import { DatabaseService } from '../database/database.service';
import { Card, Purchase, PurchaseInstallment } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchaseService {
  constructor(private readonly db: DatabaseService) {}

  async createPurchase(userId, { cardId, ...data }): Promise<Purchase | null> {
    try {
      const card = await this.db.card.findFirst({
        where: { id: cardId, userId },
      });

      if (!card) return null;

      const purchase = await this.db.purchase.create({
        data: {
          description: data.description,
          purchaseDate: new Date(data.purchaseDate),
          value: parseFloat(data.value),
          installments: parseInt(data.installments),
          cardId: card.id,
        },
      });

      // update card limit
      if (
        purchase.description !== 'Anuidade do cartão' &&
        purchase.description !== 'Taxas do cartão'
      ) {
        await this.db.card.update({
          where: { id: card.id },
          data: { ...card, currentLimit: card.currentLimit - purchase.value },
        });
      }

      const installments = await this.generateInstallments(purchase, card);

      // update invoices with the installment values
      if (
        purchase.description !== 'Anuidade do cartão' &&
        purchase.description !== 'Taxas do cartão'
      ) {
        await this.updateInvoices(card, installments, 'add');
      }

      return purchase;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async listPurchases(userId, query: any): Promise<Purchase[] | null> {
    const purchases = [];

    try {
      if (query.cardId === 'all') {
        const cards = await this.db.card.findMany({
          where: {
            userId,
          },
        });

        cards.map(async (card) => {
          const list = await this.db.purchase.findMany({
            where: { cardId: card.id },
          });
          purchases.concat(list);
        });

        return purchases;
      }

      return await this.db.purchase.findMany({
        where: { cardId: query.cardId },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updatePurchase(userId, purchaseId, data) {
    const purchase = await this.deletePurchase(userId, purchaseId);

    if (!purchase) return null;

    return await this.createPurchase(userId, data);
  }

  async deletePurchase(
    userId: string,
    purchaseId: string,
  ): Promise<Purchase | null> {
    try {
      const installments = await this.db.purchaseInstallment.findMany({
        where: {
          purchaseId,
        },
      });

      const purchase = await this.db.purchase.delete({
        where: {
          id: purchaseId,
        },
      });

      const card = await this.db.card.findFirst({
        where: { userId, id: purchase.cardId },
      });

      await this.updateInvoices(card, installments, 'restore');

      await this.db.card.update({
        where: { id: card.id },
        data: {
          ...card,
          currentLimit: card.currentLimit + purchase.value,
        },
      });

      return purchase;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async generateInstallments(
    purchase: Purchase,
    card: Card,
  ): Promise<PurchaseInstallment[]> {
    const purchaseInstallments = [];

    let currentInstallment;

    for (
      let installment = 0;
      installment < purchase.installments;
      installment++
    ) {
      if (purchase.purchaseDate.getDate() >= card.closingDay) {
        currentInstallment = await this.db.purchaseInstallment.create({
          data: {
            currentInstallment: installment + 1,
            currentValue: purchase.value / purchase.installments,
            dueDate: new Date(
              purchase.purchaseDate.getFullYear(),
              purchase.purchaseDate.getMonth() + installment + 1,
              card.dueDay,
            ),
            purchaseId: purchase.id,
          },
        });
      } else {
        currentInstallment = await this.db.purchaseInstallment.create({
          data: {
            currentInstallment: installment + 1,
            currentValue: purchase.value / purchase.installments,
            dueDate: new Date(
              purchase.purchaseDate.getFullYear(),
              purchase.purchaseDate.getMonth() + installment,
              card.dueDay,
            ),
            purchaseId: purchase.id,
          },
        });
      }
      purchaseInstallments.push(currentInstallment);
    }

    return purchaseInstallments;
  }

  private async updateInvoices(
    card: Card,
    installments: PurchaseInstallment[],
    op: string,
  ) {
    // listar as invoices
    const invoices = await this.db.transaction.findMany({
      where: {
        statementId: card.statementId,
        dueDate: {
          lte: installments[installments.length - 1].dueDate,
          gte: installments[0].dueDate,
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    // TODO: must make sure the invoices exist and create otherwise
    if (!invoices.length) return null;

    invoices.map(async (invoice, idx) => {
      try {
        await this.db.transaction.update({
          where: { id: invoice.id },
          data: {
            ...invoice,
            value:
              op === 'add'
                ? invoice.value + installments[idx].currentValue
                : invoice.value - installments[idx].currentValue,
          },
        });
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }
}
