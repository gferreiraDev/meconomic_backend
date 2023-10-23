import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly db: DatabaseService) {}

  async listInvoicePurchases(
    userId,
    {
      cardId,
      dueDate,
    }: {
      cardId: string;
      dueDate: Date;
    },
  ) {
    try {
      let installments = [];

      const minDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1);
      const maxDate = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth() + 1,
        1,
      );

      console.log('MinDate', minDate, 'MaxDate', maxDate);

      if (cardId === 'all') {
        installments = await this.db.purchaseInstallment.findMany({
          where: {
            dueDate: {
              lt: maxDate,
              gte: minDate,
            },
            purchase: {
              card: {
                userId,
              },
            },
          },
          include: { purchase: true },
        });
      } else {
        installments = await this.db.purchaseInstallment.findMany({
          where: {
            dueDate: {
              lte: maxDate,
              gte: minDate,
            },
            purchase: {
              cardId,
            },
          },
          include: { purchase: true },
        });
      }

      console.log('installments', installments);

      return installments;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
