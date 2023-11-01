import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { ReserveService } from '../reserve/reserve.service';

@Injectable()
export class PaymentService {
  constructor(
    private db: DatabaseService,
    private reserveService: ReserveService,
  ) {}

  async addPayment(data: any): Promise<Payment | null> {
    try {
      const payment = await this.db.payment.create({
        data,
        include: { reserve: true },
      });

      if (!payment) throw new Error('Erro ao adicionar pagamento');

      await this.reserveService.updateReserve(
        payment.reserve.userId,
        payment.reserve.id,
        {
          amount:
            payment.paymentType === 'deposit' ? payment.value : -payment.value,
        },
      );

      return payment;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listPayments(userId: string, query: any): Promise<Payment[]> {
    try {
      const payments = await this.db.payment.findMany({
        where: {
          reserve: {
            userId,
          },
          ...query,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });

      return payments;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
