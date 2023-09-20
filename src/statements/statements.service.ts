import { Injectable } from '@nestjs/common';
import { Statement } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { StatementDto } from './dtos/statement.dto';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class StatementsService {
  constructor(
    private db: DatabaseService,
    private transactionService: TransactionsService,
  ) {}

  async create(userId: string, data: StatementDto): Promise<Statement | null> {
    try {
      const statement = await this.db.statement.create({
        data: {
          ...data,
          months: {
            createMany: { data: data.months },
          },
          userId,
        },
        include: { months: true },
      });

      await this.transactionService.createMany(statement);

      return statement;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list(userId: string): Promise<Statement[]> {
    try {
      const statements = await this.db.statement.findMany({
        where: { userId },
        include: { months: true },
      });

      return statements;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(
    userId: string,
    id: string,
    data: Partial<StatementDto>,
  ): Promise<Statement | null> {
    try {
      const statement = await this.db.statement.update({
        where: { id, userId },
        data: {
          ...data,
          months: {
            // updateMany: {
            //   where: { statementId: id },
            //   data: [...data.months],
            // },
          },
        },
        include: { months: true },
      });

      if (!statement) return null;

      return statement;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async remove(userId: string, id: string): Promise<Statement | null> {
    try {
      await this.db.month.deleteMany({ where: { statementId: id } });

      await this.transactionService.removeMany(userId, id);

      const statement = await this.db.statement.delete({
        where: { id, userId },
      });

      return statement;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
