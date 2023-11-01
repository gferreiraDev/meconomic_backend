import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { StatementsService } from '../statements/statements.service';
import { PurchaseService } from '../purchase/purchase.service';
import { DatabaseService } from '../database/database.service';

describe('CardsController', () => {
  let configService: ConfigService;
  let cardsController: CardsController;
  let cardsService: CardsService;
  let statementService: StatementsService;
  let databaseService: DatabaseService;
  let purchaseService: PurchaseService;

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

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        ConfigService,
        DatabaseService,
        {
          provide: CardsService,
          useValue: {
            create: jest.fn().mockResolvedValue(cardMock),
            list: jest.fn().mockResolvedValue([cardMock]),
            find: jest.fn().mockResolvedValue(cardMock),
            update: jest.fn().mockResolvedValue(cardMock),
            remove: jest.fn().mockResolvedValue(cardMock),
          },
        },
        { provide: StatementsService, useValue: {} },
        { provide: PurchaseService, useValue: {} },
      ],
    }).compile();

    configService = testingModule.get<ConfigService>(ConfigService);
    cardsController = testingModule.get<CardsController>(CardsController);
    cardsService = testingModule.get<CardsService>(CardsService);
    statementService = testingModule.get<StatementsService>(StatementsService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
    purchaseService = testingModule.get<PurchaseService>(PurchaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(configService).toBeDefined();
      expect(cardsService).toBeDefined();
      expect(cardsController).toBeDefined();
      expect(cardsService).toBeDefined();
      expect(statementService).toBeDefined();
      expect(databaseService).toBeDefined();
      expect(purchaseService).toBeDefined();
    });
  });

  describe('1 - Create Card', () => {
    it('1.1 - should be able to create a card successfuly', async () => {
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
      const result = await cardsController.createCard(userId, cardData);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(cardsService.create).toBeCalledTimes(1);
    });

    it('1.2 - should throw error if card duplicated', async () => {
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
      jest.spyOn(cardsService, 'create').mockResolvedValueOnce(null);

      // Act
      const result = cardsController.createCard(userId, cardData);

      // Assert
      expect(result).rejects.toThrow();
      expect(cardsService.create).toBeCalledTimes(1);
    });

    it('1.3 - should throw error provided invalid data', async () => {
      // Arrange
      const cardData = {
        brand: '',
        name: '',
        lastNumbers: '',
        limit: 0,
        currentLimit: 0,
        closingDay: 1,
        dueDay: 1,
        annuity: 0,
        fees: 0,
        chargeRule: '',
        expiryDate: '',
        status: '',
      };
      jest.spyOn(cardsService, 'create').mockResolvedValueOnce(null);

      // Act
      const result = cardsController.createCard(userId, cardData);

      // Assert
      expect(result).rejects.toThrow();
      expect(cardsService.create).toBeCalledTimes(1);
    });
  });

  describe('2 - List Cards', () => {
    it('2.1 - should list all user cards', async () => {
      // Act
      const result = await cardsController.listCards(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(1);
      expect(cardsService.list).toBeCalledTimes(1);
    });

    it('2.2 - should return an empty array if no card was found', async () => {
      // Arrange
      jest.spyOn(cardsService, 'list').mockResolvedValueOnce([]);

      // Act
      const result = await cardsController.listCards(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(0);
      expect(cardsService.list).toBeCalledTimes(1);
    });
  });

  describe('3 - Find Card', () => {
    it('3.1 - should be able to find a single card provided a valid id', async () => {
      // Arrange
      const cardId = 'any-id12345';

      // Act
      const result = await cardsController.findCard(userId, cardId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(cardsService.find).toBeCalledTimes(1);
    });

    it('3.2 - should throw error provided an invalid id', async () => {
      // Arrange
      const cardId = 'any-id12345';
      jest.spyOn(cardsService, 'find').mockResolvedValueOnce(null);

      // Act
      const result = cardsController.findCard(userId, cardId);

      // Assert
      expect(result).rejects.toThrow();
      expect(cardsService.find).toBeCalledTimes(1);
    });
  });

  describe('4  Update Card', () => {
    it('4.1 - should update a card successfuly', async () => {
      // Arrange
      const cardId = '7va8b139-2a52-443a-bae9-5c2127575f77';
      const update = {
        brand: 'Mastercard',
        annuity: 900,
        fees: 320,
      };
      jest
        .spyOn(cardsService, 'update')
        .mockResolvedValueOnce(Object.assign(cardMock, update));

      // Act
      const result = await cardsController.updateCard(userId, cardId, update);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(cardsService.update).toBeCalledTimes(1);
    });

    it('4.2 - should update a card successfuly', async () => {
      // Arrange
      const cardId = '7va8b139-2a52-443a-bae9-5c2127575f77';
      const update = {
        brand: 'Mastercard',
        annuity: 900,
        fees: 320,
      };
      jest.spyOn(cardsService, 'update').mockResolvedValueOnce(null);

      // Act
      const result = cardsController.updateCard(userId, cardId, update);

      // Assert
      expect(result).rejects.toThrow();
      expect(cardsService.update).toBeCalledTimes(1);
    });
  });

  describe('5 - Delete Card', () => {
    it('5.1 - should be able to remove a card', async () => {
      // Arrange
      const cardId = cardMock.id;

      // Act
      const result = await cardsController.deleteCard(userId, cardId);

      // Assert
      expect(result).toBeDefined();
      expect(cardsService.remove).toBeCalledTimes(1);
    });

    it('5.2 - should throw error provided an an invalid id', async () => {
      // Arrange
      const cardId = cardMock.id;
      jest.spyOn(cardsService, 'remove').mockResolvedValueOnce(null);

      // Act
      const result = cardsController.deleteCard(userId, cardId);

      // Assert
      expect(result).rejects.toThrow();
      expect(cardsService.remove).toBeCalledTimes(1);
    });

    it('5.3 - should throw error if card was not found', async () => {
      // Arrange
      const cardId = cardMock.id;
      jest.spyOn(cardsService, 'remove').mockResolvedValueOnce(null);

      // Act
      const result = cardsController.deleteCard(userId, cardId);

      // Assert
      expect(result).rejects.toThrow();
      expect(cardsService.remove).toBeCalledTimes(1);
    });
  });
});
