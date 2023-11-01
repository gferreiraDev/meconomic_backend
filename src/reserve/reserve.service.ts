import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { Reserve } from '@prisma/client';
import { ReserveDto } from './dto/reserve.dto';

@Injectable()
export class ReserveService {
  constructor(private db: DatabaseService) {}

  async addReserve(userId: string, data: any): Promise<Reserve | null> {
    try {
      const reserve = await this.db.reserve.create({
        data: {
          ...data,
          userId,
        },
      });

      return reserve;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listReserves(userId: string): Promise<Reserve[] | null> {
    try {
      const reserves = await this.db.reserve.findMany({
        where: { userId },
      });

      return reserves;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateReserve(
    userId: string,
    id: string,
    data: Partial<ReserveDto>,
  ): Promise<Reserve | null> {
    try {
      const reserve = await this.db.reserve.update({
        where: { userId, id },
        data,
      });

      return reserve;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteReserve(userId: string, id: string): Promise<Reserve | null> {
    try {
      const reserve = await this.db.reserve.delete({
        where: { userId, id },
      });

      return reserve;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
