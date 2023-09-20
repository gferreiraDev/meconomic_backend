import { Injectable } from '@nestjs/common';
import { Month, Transaction } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { generateDate } from 'src/utils/generateDate';
import { TransactionDto } from './dtos/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private db: DatabaseService) {}

  async create(userId: string, data: TransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.db.transaction.create({
        data: {
          ...data,
          userId: userId,
          statementId: null,
        },
      });

      return transaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createMany(data: any): Promise<void> {
    try {
      const validMonths: Month[] = data?.months.filter(
        (month) => month.checked,
      );

      return validMonths.forEach(async (month, idx) => {
        await this.db.transaction.create({
          data: {
            type: data.type,
            category: data.category,
            description: data.category,
            value: data.expectedValue,
            dueDate: generateDate(month.month, data.dueDay),
            payDate: generateDate(month.month, data.dueDay),
            installments: data.installments,
            installment: idx + 1,
            // installment: parseInt(month.month),
            userId: data.userId,
            statementId: data.id,
            status: 'Pendente',
          },
        });
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list(userId, query: any): Promise<Transaction[]> {
    try {
      const dueDate = query?.dueDate ? new Date(query.dueDate) : null;

      let transactions;

      if (dueDate) {
        const minDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1);
        const maxDate = new Date(
          dueDate.getFullYear(),
          dueDate.getMonth() + 1,
          1,
        );

        transactions = await this.db.transaction.findMany({
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
      } else {
        transactions = await this.db.transaction.findMany({
          where: { userId, ...query },
          orderBy: { dueDate: 'asc' },
          take: 50,
        });
      }

      return transactions;
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
      const transaction = await this.db.transaction.update({
        where: { id, userId },
        data,
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
    console.log({ userId }, { statementId });

    try {
      const transactions = await this.db.transaction.deleteMany({
        where: { userId, statementId },
      });

      console.log(transactions);

      return transactions;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
