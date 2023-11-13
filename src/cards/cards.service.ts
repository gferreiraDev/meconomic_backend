import { BadRequestException, Injectable } from '@nestjs/common';
import { Card, Statement } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CardDto } from './dtos/Card.dto';
import { generateMonths } from '../utils/generateMonthArray';
import { StatementsService } from '../statements/statements.service';
import { PurchaseService } from '../purchase/purchase.service';

@Injectable()
export class CardsService {
  constructor(
    private db: DatabaseService,
    private statementService: StatementsService,
    private purchaseService: PurchaseService,
  ) {}

  async create(userId: string, data: CardDto): Promise<Card | null> {
    try {
      const cardExists = await this.db.card.findFirst({
        where: {
          lastNumbers: data.lastNumbers,
          userId: userId,
        },
      });

      if (cardExists) throw new BadRequestException('Cartão já existe');

      const cardStatement: Statement = await this.statementService.create(
        userId,
        {
          type: 'DA',
          subcategory: null,
          category: 'Fatura Cartão',
          description: `Fatura ${data.name}`,
          expectedValue: data.annuity / 12 + data.fees / 12,
          dueDay: data.dueDay,
          installments: 12,
          months: generateMonths(),
        },
      );

      const card = await this.db.card.create({
        data: {
          ...data,
          currentLimit: data.limit,
          userId,
          statementId: cardStatement.id,
        },
      });

      if (card.annuity > 0) {
        await this.purchaseService.createPurchase(userId, {
          purchaseDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            card.closingDay,
          ),
          value: card.annuity,
          description: 'Anuidade do cartão',
          installments: 12,
          cardId: card.id,
        });
      }

      if (card.fees > 0) {
        await this.purchaseService.createPurchase(userId, {
          purchaseDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            card.closingDay,
          ),
          value: card.fees,
          description: 'Taxas do cartão',
          installments: 12,
          cardId: card.id,
        });
      }

      return card;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async list(userId: string): Promise<Card[]> {
    try {
      const cards = await this.db.card.findMany({
        where: { userId },
      });

      return cards;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async find(userId: string, id: string): Promise<Card | null> {
    try {
      const card = await this.db.card.findFirst({
        where: { id, userId },
      });

      return card;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(userId: string, id: string, data: any): Promise<Card | null> {
    try {
      const card = await this.db.card.update({
        where: { id, userId },
        data: { ...data, currentLimit: data.limit },
      });

      if (!card) return null;

      return card;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async remove(userId: string, id: string): Promise<Card | null> {
    try {
      const card = await this.db.card.delete({
        where: { userId, id },
      });

      await this.statementService.remove(userId, card.statementId);

      return card;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
