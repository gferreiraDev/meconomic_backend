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
        // const currentDate = dueDate
        //   .toLocaleDateString('en-us')
        //   .replace(/\/\d+\//, '/01/');

        // if (!months.includes(currentDate)) {
        //   months.push(currentDate);
        // }

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
      };

      return resultSet;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // listar os lançamentos de um determinado mês
  // separar os lançamentos entre os tipos
  // somar o total de receitas e despesas
  // calcular o valor pendente e pago entre receitas e despesas
  // retornar o saldo previsto receitas - despesas
}
