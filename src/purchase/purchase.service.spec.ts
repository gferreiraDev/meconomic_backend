import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { DatabaseService } from '../database/database.service';

describe('PurchaseService', () => {
  let purchaseService: PurchaseService;
  let databaseService: DatabaseService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const transactionsMock = [
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h87',
      type: 'DA',
      category: 'Fatura Cartão',
      subcategory: '',
      description: 'Fatura Cartão Visa Teste',
      value: 900.0,
      dueDate: new Date('2023-11-20'),
      payDate: new Date('2023-11-20'),
      installments: 12,
      installment: 1,
      status: 'Pendente',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      statementId: '3fa8b139-3b63-443a-bae9-5c2127575f25',
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h87',
      type: 'DA',
      category: 'Fatura Cartão',
      subcategory: '',
      description: 'Fatura Cartão Visa Teste',
      value: 900.0,
      dueDate: new Date('2023-12-20'),
      payDate: new Date('2023-12-20'),
      installments: 12,
      installment: 2,
      status: 'Pendente',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      statementId: '3fa8b139-3b63-443a-bae9-5c2127575f25',
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h87',
      type: 'DA',
      category: 'Fatura Cartão',
      subcategory: '',
      description: 'Fatura Cartão Visa Teste',
      value: 900.0,
      dueDate: new Date('2024-01-20'),
      payDate: new Date('2024-01-20'),
      installments: 12,
      installment: 3,
      status: 'Pendente',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      statementId: '3fa8b139-3b63-443a-bae9-5c2127575f25',
    },
  ];
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
  const purchaseMock = {
    id: 'r7e58f2ab2-ss1w-18ws-aw2r-11w4vaht2a8e',
    purchaseDate: new Date(),
    value: 330.3,
    description: 'Compra teste',
    installments: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    cardId: '7va8b139-2a52-443a-bae9-5c2127575f77',
    purchaseInstallments: [],
  };
  const purchaseInstallmentMock = {};

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: DatabaseService,
          useValue: {
            purchase: {
              create: jest.fn().mockResolvedValue(purchaseMock),
              update: jest.fn().mockResolvedValue(purchaseMock),
              findMany: jest.fn().mockResolvedValue([purchaseMock]),
              delete: jest.fn().mockResolvedValue(purchaseMock),
            },
            card: {
              findFirst: jest.fn().mockResolvedValue(cardMock),
              findMany: jest.fn().mockResolvedValue([cardMock]),
              update: jest.fn().mockResolvedValue(cardMock),
            },
            purchaseInstallment: {
              create: jest.fn().mockResolvedValue(purchaseInstallmentMock),
              findMany: jest.fn().mockResolvedValue([purchaseInstallmentMock]),
            },
            transaction: {
              findMany: jest.fn().mockResolvedValue(transactionsMock),
              update: jest.fn().mockResolvedValue(transactionsMock),
            },
          },
        },
      ],
    }).compile();

    purchaseService = testingModule.get<PurchaseService>(PurchaseService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(purchaseService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - Create Purchase', () => {
    it('1.1 - should be able to register a card purchase', async () => {
      //Arrange
      const data = {
        purchaseDate: new Date(),
        value: 330.3,
        description: 'Compra teste',
        installments: 3,
        cardId: '7va8b139-2a52-443a-bae9-5c2127575f77',
      };

      // Act
      const result = await purchaseService.createPurchase(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.findFirst).toBeCalledTimes(1);
      expect(databaseService.purchase.create).toBeCalledTimes(1);
      expect(databaseService.card.update).toBeCalledTimes(1);
      expect(databaseService.purchaseInstallment.create).toBeCalledTimes(3);
      expect(databaseService.transaction.findMany).toBeCalledTimes(1);
      expect(databaseService.transaction.update).toBeCalledTimes(3);
    });

    it('1.2 - should return null if card not found', async () => {
      //Arrange
      const data = {
        purchaseDate: new Date(),
        value: 330.3,
        description: 'Compra teste',
        installments: 3,
        cardId: '7va8b139-2a52-443a-bae9-5c2127575f77',
      };
      jest
        .spyOn(databaseService['card'], 'findFirst')
        .mockResolvedValueOnce(null);

      // Act
      const result = await purchaseService.createPurchase(userId, data);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.card.findFirst).toBeCalledTimes(1);
      expect(databaseService.purchase.create).not.toBeCalled();
      expect(databaseService.card.update).not.toBeCalled();
      expect(databaseService.purchaseInstallment.create).not.toBeCalled();
      expect(databaseService.transaction.findMany).not.toBeCalled();
      expect(databaseService.transaction.update).not.toBeCalled();
    });

    it('1.3 - should return null if card does not have invoices set', async () => {
      //Arrange
      const data = {
        purchaseDate: new Date(),
        value: 330.3,
        description: 'Compra teste',
        installments: 3,
        cardId: '7va8b139-2a52-443a-bae9-5c2127575f77',
      };
      jest
        .spyOn(databaseService['transaction'], 'findMany')
        .mockResolvedValueOnce([]);

      // Act
      const result = await purchaseService.createPurchase(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.findFirst).toBeCalledTimes(1);
      expect(databaseService.purchase.create).toBeCalledTimes(1);
      expect(databaseService.card.update).toBeCalledTimes(1);
      expect(databaseService.purchaseInstallment.create).toBeCalledTimes(3);
      expect(databaseService.transaction.findMany).toBeCalledTimes(1);
      expect(databaseService.transaction.update).not.toBeCalled();
    });
  });

  describe('2 - List Purchases', () => {
    it('2.1 - should return a list of all purchases', async () => {
      // Arrange
      const query = {
        cardId: 'all',
      };

      // Act
      const result = await purchaseService.listPurchases(userId, query);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.findMany).toBeCalledTimes(1);
      expect(databaseService.purchase.findMany).toBeCalledTimes(1);
    });

    it('2.2 - should return a list of all purchases provided a card id', async () => {
      // Arrange
      const query = {
        cardId: cardMock.id,
      };

      // Act
      const result = await purchaseService.listPurchases(userId, query);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.card.findMany).not.toBeCalled();
      expect(databaseService.purchase.findMany).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Purchase', () => {
    it('3.1 - should update a purchase', async () => {
      // Arrange
      const purchaseId = '8fp515-erg5-441w-er545r6t';
      const update = {
        value: 444.44,
        description: 'Compra teste',
        installments: 4,
      };

      jest
        .spyOn(databaseService['purchase'], 'update')
        .mockResolvedValueOnce(Object.assign(purchaseMock, update));

      // Act
      const result = await purchaseService.updatePurchase(
        userId,
        purchaseId,
        update,
      );

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.purchase.delete).toBeCalledTimes(1);
      expect(databaseService.card.findFirst).toBeCalledTimes(2);
      expect(databaseService.purchase.create).toBeCalledTimes(1);
      expect(databaseService.card.update).toBeCalledTimes(2);
      expect(databaseService.purchaseInstallment.create).toBeCalledTimes(4);
      expect(databaseService.transaction.findMany).toBeCalledTimes(2);
      expect(databaseService.transaction.update).toBeCalledTimes(4);
    });

    it('3.2 - should return null if no purchase was found', async () => {
      // Arrange
      const purchaseId = '';
      const update = {
        value: 444.44,
        description: 'Compra teste',
        installments: 4,
      };
      jest
        .spyOn(databaseService['purchase'], 'delete')
        .mockRejectedValueOnce(null);

      // Act
      const result = await purchaseService.updatePurchase(
        userId,
        purchaseId,
        update,
      );

      // Assert
      expect(result).toBeNull();
      expect(databaseService.purchase.delete).toBeCalledTimes(1);
      expect(databaseService.card.findFirst).not.toBeCalled();
      expect(databaseService.purchase.create).not.toBeCalled();
      expect(databaseService.card.update).not.toBeCalled();
      expect(databaseService.purchaseInstallment.create).not.toBeCalled();
      expect(databaseService.transaction.findMany).not.toBeCalled();
      expect(databaseService.transaction.update).not.toBeCalled();
    });
  });
});
