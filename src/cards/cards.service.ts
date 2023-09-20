import { BadRequestException, Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CardDto } from './dtos/Card.dto';
import { generateMonths } from '../utils/generateMonthArray';
import { StatementsService } from '../statements/statements.service';

@Injectable()
export class CardsService {
  constructor(
    private db: DatabaseService,
    private statementService: StatementsService,
  ) {}

  async create(userId: string, data: CardDto): Promise<Card | null> {
    try {
      const cardExists = await this.db.card.findFirst({
        where: {
          lastNumbers: data.lastNumbers,
          userId,
        },
      });

      if (cardExists) throw new BadRequestException('Cartão já existe');

      // Create Card
      const card = await this.db.card.create({
        data: {
          ...data,
          currentLimit: data.limit,
          userId,
        },
      });

      // Create a Card Statement
      // const cardStatement = {
      //   type: 'DA',
      //   category: 'Fatura Cartão',
      //   description: `Fatura ${card.name}`,
      //   expectedValue: card.annuity / 12 + card.fees / 12,
      //   dueDay: card.dueDay,
      //   installments: 12,
      //   userId,
      // };

      await this.statementService.create(userId, {
        type: 'DA',
        subcategory: null,
        category: 'Fatura Cartão',
        description: `Fatura ${card.name}`,
        expectedValue: card.annuity / 12 + card.fees / 12,
        dueDay: card.dueDay,
        installments: 12,
        months: generateMonths(),
      });

      // await this.db.statement.create({
      //   data: {
      //     ...cardStatement,
      //     months: {
      //       createMany: { data: generateMonths() },
      //     },
      //   },
      // });

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
        data: { ...data },
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

      return card;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
