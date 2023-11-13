import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { Target } from '@prisma/client';

@Injectable()
export class TargetService {
  constructor(private readonly db: DatabaseService) {}

  async createTarget(userId: string, data: any): Promise<Target | null> {
    try {
      const target = await this.db.target.create({
        data: {
          ...data,
          userId,
        },
      });

      return target;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listTargets(userId: string): Promise<Target[]> {
    const targets = await this.db.target.findMany({
      where: { userId },
    });

    return targets;
  }

  async updateTarget(
    userId: string,
    id: string,
    data: any,
  ): Promise<Target | null> {
    try {
      const target = await this.db.target.update({
        where: { userId, id },
        data,
      });

      return target;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteTarget(userId: string, id: string): Promise<Target | null> {
    try {
      const target = await this.db.target.delete({
        where: { userId, id },
      });

      return target;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
