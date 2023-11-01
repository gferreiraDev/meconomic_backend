import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { StatementsService } from '../statements/statements.service';
import { PurchaseService } from '../purchase/purchase.service';
import { DatabaseService } from '../database/database.service';

describe('CardsService', () => {
  let cardsService: CardsService;
  let statementService: StatementsService;
  let purchaseService: PurchaseService;
  let databaseService: DatabaseService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const cardMock = {
    id: '7va8b139-2a52-443a-bae9-5c2127575f77',
    brand: 'Visa',
    name: 'Cartão Visa Teste',
    lastNumbers: '0001',
    limit: 5200,
    currentLimit: 5200,
    closingDay: 10,
    dueDay: 20,
    annuity: 680,
    fees: 250,
    chargeRule: 'always',
    expiryDate: '11/2030',
    status: 'Ativo',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
    statementId: '3ab8f139-2a52-443a-bae9-5c2127575f28',
  };
  const statementMock = {
    id: '3ab8f139-2a52-443a-bae9-5c2127575f28',
    type: 'DA',
    category: 'Fatura Cartão',
    subcategory: '',
    description: 'Fatura Cartão Visa Teste',
    expectedValue: 77.5,
    dueDay: 10,
    installments: 12,
    months: [
      { month: '1', label: 'Jan', checked: true },
      { month: '2', label: 'Fev', checked: true },
      { month: '3', label: 'Mar', checked: true },
      { month: '4', label: 'Abr', checked: true },
      { month: '5', label: 'Mai', checked: true },
      { month: '6', label: 'Jun', checked: true },
      { month: '7', label: 'Jul', checked: true },
      { month: '8', label: 'Ago', checked: true },
      { month: '9', label: 'Set', checked: true },
      { month: '10', label: 'Out', checked: true },
      { month: '11', label: 'Nov', checked: true },
      { month: '12', label: 'Dez', checked: true },
    ],
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: DatabaseService,
          useValue: {
            card: {
              findFirst: jest.fn().mockResolvedValue(cardMock),
              create: jest.fn().mockResolvedValue(cardMock),
              findMany: jest.fn().mockResolvedValue([cardMock]),
              update: jest.fn().mockResolvedValue(cardMock),
              delete: jest.fn().mockResolvedValue(cardMock),
            },
          },
        },
        {
          provide: PurchaseService,
          useValue: {
            createPurchase: jest.fn(),
          },
        },
        {
          provide: StatementsService,
          useValue: {
            create: jest.fn().mockResolvedValue(statementMock),
            remove: jest.fn().mockResolvedValue(statementMock),
          },
        },
      ],
    }).compile();

    cardsService = testingModule.get<CardsService>(CardsService);
    statementService = testingModule.get<StatementsService>(StatementsService);
    purchaseService = testingModule.get<PurchaseService>(PurchaseService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(cardsService).toBeDefined();
      expect(statementService).toBeDefined();
      expect(purchaseService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - Create Card', () => {
    it('1.1 - should be able to create a new card', async () => {
      // Arrange
      const cardData = {
        brand: 'Visa',
        name: 'Cartão Visa Teste',
        lastNumbers: '0001',
        limit: 5200,
        currentLimit: 5200,
        closingDay: 10,
        dueDay: 20,
        annuity: 680,
        fees: 250,
        chargeRule: 'always',
        expiryDate: '11/2030',
        status: 'Ativo',
      };
      jest
        .spyOn(databaseService['card'], 'findFirst')
        .mockResolvedValueOnce(null);

      // Act
      const result = await cardsService.create(userId, cardData);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.findFirst).toBeCalledTimes(1);
      expect(statementService.create).toBeCalledTimes(1);
      expect(databaseService.card.create).toBeCalledTimes(1);
      expect(purchaseService.createPurchase).toBeCalledTimes(2);
    });

    it('1.2 - should throw error if card already exists', async () => {
      // Arrange
      const cardData = {
        brand: 'Visa',
        name: 'Cartão Visa Teste',
        lastNumbers: '0001',
        limit: 5200,
        currentLimit: 5200,
        closingDay: 10,
        dueDay: 20,
        annuity: 680,
        fees: 250,
        chargeRule: 'always',
        expiryDate: '11/2030',
        status: 'Ativo',
      };

      // Act
      const result = await cardsService.create(userId, cardData);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.card.findFirst).toBeCalledTimes(1);
      expect(statementService.create).not.toBeCalled();
      expect(databaseService.card.create).not.toBeCalled();
      expect(purchaseService.createPurchase).not.toBeCalled();
    });
  });

  describe('2 - List Cards', () => {
    it('2.1 - should list all user cards', async () => {
      // Act
      const result = await cardsService.list(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(databaseService.card.findMany).toBeCalledTimes(1);
    });

    it('2.2 - should return an empty array if no card was found', async () => {
      // Arrange
      jest.spyOn(databaseService['card'], 'findMany').mockResolvedValueOnce([]);

      // Act
      const result = await cardsService.list(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(databaseService.card.findMany).toBeCalledTimes(1);
    });
  });

  describe('3 - Find Card', () => {
    it('3.1 - should return an user card provided a valid id', async () => {
      // Arrange
      const cardId = '7va8b139-2a52-443a-bae9-5c2127575f77';

      // Act
      const result = await cardsService.find(userId, cardId);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.findFirst).toBeCalledTimes(1);
    });

    it('3.2 - should return null if card not found', async () => {
      // Arrange
      const cardId = '7va8b139-2a52-443a-bae9-5c2127575f77';
      jest
        .spyOn(databaseService['card'], 'findFirst')
        .mockResolvedValueOnce(null);

      // Act
      const result = await cardsService.find(userId, cardId);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.card.findFirst).toBeCalledTimes(1);
    });
  });

  describe('4 - Update Card', () => {
    it('4.1 - should be able to update a card', async () => {
      // Arrange
      const cardId = cardMock.id;
      const update = {
        name: 'Cartão Atualizado',
        currentLimit: 4900.99,
      };
      jest
        .spyOn(databaseService['card'], 'update')
        .mockResolvedValueOnce(Object.assign(cardMock, update));

      // Act
      const result = await cardsService.update(userId, cardId, update);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.update).toBeCalledTimes(1);
    });

    it('4.2 - should return null if card not found', async () => {
      // Arrange
      const cardId = cardMock.id;
      const update = {
        name: 'Cartão Atualizado',
        currentLimit: 4900.99,
      };
      jest.spyOn(databaseService['card'], 'update').mockRejectedValueOnce(null);

      // Act
      const result = await cardsService.update(userId, cardId, update);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.card.update).toBeCalledTimes(1);
    });
  });

  describe('5 - Delete Card', () => {
    it('5.1 - should be able to delete a card', async () => {
      // Arrange
      const cardId = cardMock.id;

      // Act
      const result = await cardsService.remove(userId, cardId);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.delete).toBeCalledTimes(1);
    });

    it('5.2 - should return null provided an invalid card id', async () => {
      // Arrange
      const cardId = cardMock.id;
      jest.spyOn(databaseService['card'], 'delete').mockRejectedValueOnce(null);

      // Act
      const result = await cardsService.remove(userId, cardId);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.card.delete).toBeCalledTimes(1);
    });
  });
});
