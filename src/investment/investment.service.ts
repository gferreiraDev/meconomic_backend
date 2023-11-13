import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Investment } from '@prisma/client';

@Injectable()
export class InvestmentService {
  constructor(private readonly db: DatabaseService) {}

  async addInvestment(userId: string, data: any): Promise<Investment | null> {
    try {
      const investment = await this.db.investment.create({
        data: {
          ...data,
          userId,
        },
      });

      return investment;
    } catch (error) {
      return null;
    }
  }

  async listInvestments(userId: string): Promise<Investment[]> {
    const investments = await this.db.investment.findMany({
      where: { userId },
    });

    return investments;
  }

  async updateInvestment(
    userId: string,
    id: string,
    data: any,
  ): Promise<Investment | null> {
    try {
      const investment = await this.db.investment.update({
        where: { userId, id },
        data,
      });

      return investment;
    } catch (error) {
      return null;
    }
  }

  async deleteInvestment(
    userId: string,
    id: string,
  ): Promise<Investment | null> {
    try {
      const investment = await this.db.investment.delete({
        where: { userId, id },
      });

      return investment;
    } catch (error) {
      return null;
    }
  }
}
