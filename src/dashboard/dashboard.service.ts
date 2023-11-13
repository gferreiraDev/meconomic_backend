import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  private generateMonthList = () => {
    const currentDate = new Date();
    const months = [];

    for (let i = 0; i < 12; i++) {
      const currentMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      ).toLocaleDateString('en-us');

      months.push(currentMonthDate);
    }

    return months;
  };

  async getData(userId: string): Promise<any> {
    const months = this.generateMonthList();
    const incomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const expenses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const totalDF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const totalDV = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const totalDA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const totalRF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const totalRV = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const totalRA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let totalIncomes = 0;
    let totalExpenses = 0;

    try {
      const transactions = await this.db.transaction.findMany({
        where: { userId },
        select: { type: true, value: true, dueDate: true },
        orderBy: {
          dueDate: 'asc',
        },
      });

      transactions.forEach(({ type, value, dueDate }) => {
        const month = dueDate.getMonth();

        if (type.startsWith('D')) {
          expenses[month] = expenses[month] + value;
          totalExpenses += value;
          if (type === 'DF') {
            totalDF[month] = totalDF[month] + value;
          } else if (type === 'DV') {
            totalDV[month] = totalDV[month] + value;
          } else if (type === 'DA') {
            totalDA[month] = totalDA[month] + value;
          }
        } else if (type.startsWith('R')) {
          incomes[month] = incomes[month] + value;
          totalIncomes += value;
          if (type === 'RF') {
            totalRF[month] = totalRF[month] + value;
          } else if (type === 'RV') {
            totalRV[month] = totalRV[month] + value;
          } else if (type === 'RA') {
            totalRA[month] = totalRA[month] + value;
          }
        }
      });

      const result = incomes.map((item, idx) => item - expenses[idx]);

      const complementaryInfo = await this.getComplementInfo(userId);

      const resultSet = {
        labels: months,
        incomes: incomes.map((value) => value.toFixed(2)),
        expenses: expenses.map((value) => value.toFixed(2)),
        result: result.map((value) => value.toFixed(2)),
        totalDF,
        totalDV,
        totalDA,
        totalRF,
        totalRV,
        totalRA,
        totalIncomes,
        totalExpenses,
        ...complementaryInfo,
      };

      return resultSet;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async getComplementInfo(userId: string): Promise<any> {
    const result = {
      currentPendingSum: 0,
      investmentsSum: 0,
      walletSum: 0,
      targetSum: 0,
    };

    const refDate = new Date();
    const minDate = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
    const maxDate = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1);

    try {
      const investments = await this.db.investment.aggregate({
        where: { userId },
        _sum: { value: true },
      });

      const reserves = await this.db.reserve.aggregate({
        where: { userId },
        _sum: { amount: true },
      });

      const targets = await this.db.target.aggregate({
        where: { userId },
        _sum: { currentValue: true },
      });

      const transactions = await this.db.transaction.findMany({
        where: {
          userId,
          dueDate: {
            lte: maxDate,
            gte: minDate,
          },
        },
      });

      const transactionSum = transactions.reduce(
        (sum, current) =>
          current.type.startsWith('D')
            ? (sum -= current.value)
            : current.type.startsWith('R')
            ? (sum += current.value)
            : 0,
        0,
      );

      result.investmentsSum = investments._sum.value;
      result.walletSum = reserves._sum.amount;
      result.targetSum = targets._sum.currentValue;
      result.currentPendingSum = transactionSum;
      return result;
    } catch (error) {}
  }
}
