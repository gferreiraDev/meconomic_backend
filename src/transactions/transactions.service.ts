import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { generateDate } from '../utils/generateDate';
import { TransactionDto } from './dtos/transaction.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class TransactionsService {
  constructor(
    private db: DatabaseService,
    private paymentService: PaymentService,
  ) {}

  async create(userId: string, data: TransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.db.transaction.create({
        data: {
          ...data,
          userId: userId,
        },
      });

      return transaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createMany(data: any): Promise<any> {
    try {
      const recorrence = data?.months.filter((month) => month.checked);

      const preList = this.generateTransactionList(data, recorrence);

      const transactions = preList.map(async (item, idx) => {
        return await this.create(data.userId, {
          ...item,
          installment: idx + 1,
        });
      });

      return transactions;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list(userId: string, query: any): Promise<any> {
    try {
      const dueDate = query?.dueDate ? new Date(query.dueDate) : new Date();
      const { minDate, maxDate } = this.defineDateRange(dueDate);

      const transactions = await this.db.transaction.findMany({
        where: {
          userId,
          dueDate: {
            lte: maxDate,
            gte: minDate,
          },
        },
        orderBy: { dueDate: 'asc' },
        take: 50,
      });

      const report = await this.getMonthTotal(userId, dueDate);

      return { transactions, report };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(
    userId: string,
    id: string,
    data: any,
  ): Promise<Transaction | null> {
    try {
      let transaction = await this.db.transaction.findFirst({
        where: { id, userId },
      });

      if (transaction.status !== 'Quitado' && data?.status === 'Quitado') {
        return this.registerPayment(userId, data);
      }

      const { reserveId, ...updatingDate } = data;

      transaction = await this.db.transaction.update({
        where: { id, userId },
        data: updatingDate,
      });

      return transaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async remove(userId: string, id: string): Promise<Transaction | null> {
    try {
      const transaction = await this.db.transaction.delete({
        where: { id, userId },
      });

      return transaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async removeMany(userId: string, statementId: string): Promise<any> {
    try {
      const transactions = await this.db.transaction.deleteMany({
        where: { userId, statementId },
      });

      return transactions;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async registerPayment(userId: string, data: any): Promise<any> {
    const reserve = await this.db.reserve.findFirst({
      where: { id: data.reserveId },
    });

    if (!reserve) throw new BadRequestException('Reserva não encontrada');
    if (data.type.startsWith('D') && reserve.amount < data.value)
      throw new BadRequestException('Saldo insuficiente');

    try {
      const update = await this.db.transaction.update({
        where: { id: data.id, userId },
        data: {
          value: data.value,
          status: data.status,
          payDate: data.payDate,
        },
      });

      await this.paymentService.addPayment({
        value: update.value,
        payDate: update.payDate,
        paymentType: update.type.startsWith('D') ? 'withdrawal' : 'deposit',
        transactionId: update.id,
        reserveId: data.reserveId,
      });

      if (data.type.startsWith('D')) {
        await this.db.reserve.update({
          where: { id: reserve.id, userId },
          data: { ...reserve, amount: reserve.amount - data.value },
        });
      } else {
        await this.db.reserve.update({
          where: { id: reserve.id, userId },
          data: { ...reserve, amount: reserve.amount + data.value },
        });
      }

      if (update.category === 'Fatura Cartão') {
        const statement = await this.db.statement.findFirst({
          where: { id: update.statementId },
          include: { card: true },
        });

        await this.db.card.update({
          where: { id: statement.card.id },
          data: {
            currentLimit:
              statement.card.currentLimit +
              (update.value - statement.expectedValue),
          },
        });
      }

      return update;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /*========| PRIVATE USEFUL METHODS |============================================ */
  private generateTransactionList(data: any, months: Array<any>) {
    return months
      .map((month) => {
        const refDate = generateDate(month.month, data.dueDay);

        return {
          type: data.type,
          category: data.category,
          description: data.description,
          value: data.expectedValue,
          dueDate: refDate,
          payDate: refDate,
          installments: data.installments,
          statementId: data.id,
          status: 'Pendente',
        };
      })
      .sort((m1, m2) =>
        m1.dueDate > m2.dueDate ? 1 : m1.dueDate < m2.dueDate ? -1 : 0,
      );
  }

  private defineDateRange(date: Date) {
    const minDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const maxDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    return { minDate, maxDate };
  }

  private async getMonthTotal(userId, referenceMonth: Date): Promise<any> {
    const { minDate, maxDate } = this.defineDateRange(referenceMonth);
    const expectedIndexes = {
      expenses: {
        fixed: 0,
        variable: 0,
        discretionary: 0,
        total: 0,
      },
      incomes: {
        fixed: 0,
        variable: 0,
        discretionary: 0,
        total: 0,
      },
    };
    const indexes = {
      expenses: {
        fixed: 0,
        variable: 0,
        discretionary: 0,
        pending: 0,
        paid: 0,
        total: 0,
      },
      incomes: {
        fixed: 0,
        variable: 0,
        discretionary: 0,
        pending: 0,
        paid: 0,
        total: 0,
      },
      balance: 0,
    };

    const transactions = await this.db.transaction.groupBy({
      by: ['type', 'status', 'statementId'],
      where: {
        userId,
        dueDate: {
          lte: maxDate,
          gte: minDate,
        },
      },
      _sum: {
        value: true,
      },
    });

    transactions.forEach(async (transaction) => {
      const statement = await this.db.statement.findFirst({
        where: { id: transaction.statementId },
      });

      if (statement?.type.startsWith('D')) {
        expectedIndexes.expenses.total += statement.expectedValue;

        if (statement.type === 'DF') {
          expectedIndexes.expenses.fixed += statement.expectedValue;
        } else if (statement.type === 'DV') {
          expectedIndexes.expenses.variable += statement.expectedValue;
        } else if (statement.type === 'DA') {
          expectedIndexes.expenses.discretionary += statement.expectedValue;
        }
      } else if (statement?.type.startsWith('R')) {
        expectedIndexes.incomes.total += statement.expectedValue;

        if (statement.type === 'RF') {
          expectedIndexes.incomes.fixed += statement.expectedValue;
        } else if (statement.type === 'RV') {
          expectedIndexes.incomes.variable += statement.expectedValue;
        } else if (statement.type === 'RA') {
          expectedIndexes.incomes.discretionary += statement.expectedValue;
        }
      }
    });

    // retorna no formato do gráfico
    transactions.forEach((item) => {
      if (item.type.startsWith('D')) {
        if (item.status === 'Quitado') {
          indexes.expenses.paid += item?._sum?.value;
        } else {
          indexes.expenses.pending += item?._sum?.value;
        }

        if (item.type === 'DF') {
          indexes.expenses.fixed += item._sum.value;
        } else if (item.type === 'DV') {
          indexes.expenses.variable += item._sum.value;
        } else if (item.type === 'DA') {
          indexes.expenses.discretionary += item._sum.value;
        }
      } else if (item.type.startsWith('R')) {
        if (item.status === 'Quitado') {
          indexes.incomes.paid += item._sum.value;
        } else {
          indexes.incomes.pending += item._sum.value;
        }

        if (item.type === 'RF') {
          indexes.incomes.fixed += item._sum.value;
        } else if (item.type === 'RV') {
          indexes.incomes.variable += item._sum.value;
        } else if (item.type === 'RA') {
          indexes.incomes.discretionary += item._sum.value;
        }
      }
    });

    indexes.expenses.total = indexes.expenses.pending + indexes.expenses.paid;
    indexes.incomes.total = indexes.incomes.pending + indexes.incomes.paid;
    indexes.balance = indexes.incomes.total - indexes.expenses.total;

    return { indexes, expectedIndexes };
  }
}
