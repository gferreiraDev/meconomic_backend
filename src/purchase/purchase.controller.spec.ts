import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';

describe('PurchaseController', () => {
  let purchaseController: PurchaseController;
  let purchaseService: PurchaseService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
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

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        {
          provide: PurchaseService,
          useValue: {
            listPurchases: jest.fn().mockResolvedValue(transactionsMock),
            createPurchase: jest.fn().mockResolvedValue(purchaseMock),
            updatePurchase: jest.fn().mockResolvedValue(purchaseMock),
            deletePurchase: jest.fn().mockResolvedValue(purchaseMock),
          },
        },
      ],
    }).compile();

    purchaseController =
      testingModule.get<PurchaseController>(PurchaseController);
    purchaseService = testingModule.get<PurchaseService>(PurchaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(purchaseController).toBeDefined();
      expect(purchaseService).toBeDefined();
    });
  });

  describe('1 - Create Purchase', () => {
    it('1.1 - should be able to create a new purchase', async () => {
      // Arrange
      const body = {
        purchaseDate: new Date(),
        value: 330.3,
        description: 'Compra teste',
        installments: 3,
        cardId: '7va8b139-2a52-443a-bae9-5c2127575f77',
      };

      // Act
      const result = await purchaseController.addPurchase(userId, body);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(purchaseService.createPurchase).toBeCalledTimes(1);
    });

    it('1.2 - should throw error provided invalid data', async () => {
      // Arrange
      const body = {
        purchaseDate: null,
        value: null,
        description: '',
        installments: null,
        cardId: '',
      };

      jest.spyOn(purchaseService, 'createPurchase').mockResolvedValueOnce(null);

      // Act
      const result = purchaseController.addPurchase(userId, body);

      // Assert
      expect(result).rejects.toThrow();
      expect(purchaseService.createPurchase).toBeCalledTimes(1);
    });
  });

  describe('2 - List Purchases', () => {
    it('2.1 - should return purchases of all cards successfuly', async () => {
      // Arrange
      const query = {
        cardId: 'all',
      };

      // Act
      const result = await purchaseController.listPurchases(userId, query);

      // Assert
      expect(result).toBeDefined();
      expect(purchaseService.listPurchases).toBeCalledTimes(1);
    });

    it('2.2 - should return purchases of a single card successfuly', async () => {
      // Arrange
      const query = {
        cardId: '7va8b139-2a52-443a-bae9-5c2127575f77',
      };

      // Act
      const result = await purchaseController.listPurchases(userId, query);

      // Assert
      expect(result).toBeDefined();
      expect(purchaseService.listPurchases).toBeCalledTimes(1);
    });

    it('2.3 - should throw error provided an invalid card id', async () => {
      // Arrange
      const query = {
        cardId: '',
      };

      jest.spyOn(purchaseService, 'listPurchases').mockResolvedValueOnce(null);

      // Act
      const result = purchaseController.listPurchases(userId, query);

      // Assert
      expect(result).rejects.toThrow();
      expect(purchaseService.listPurchases).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Purchase', () => {
    it('3.1 - should be able to update a puchase', async () => {
      // Arrange
      const purchaseId = '8fp515-erg5-441w-er545r6t';
      const update = {
        value: 444.44,
        description: 'Compra teste',
        installments: 4,
      };

      // Act
      const result = await purchaseController.updatePurchase(
        userId,
        purchaseId,
        update,
      );

      // Assert
      expect(result).toBeDefined();
      expect(purchaseService.updatePurchase).toBeCalledTimes(1);
    });

    it('3.2 - should throw error provided an invalid purchase id', async () => {
      // Arrange
      const purchaseId = '';
      const update = {
        value: 444.44,
        description: 'Compra teste',
        installments: 4,
      };

      jest.spyOn(purchaseService, 'updatePurchase').mockResolvedValueOnce(null);

      // Act
      const result = purchaseController.updatePurchase(
        userId,
        purchaseId,
        update,
      );

      // Assert
      expect(result).rejects.toThrow();
      expect(purchaseService.updatePurchase).toBeCalledTimes(1);
    });
  });

  describe('4 - Delete Purchase', () => {
    it('4.1 - should be able to delete a purchase', async () => {
      // Arrange
      const purchaseId = '8fp515-erg5-441w-er545r6t';

      // Act
      const result = await purchaseController.deletePurchase(
        userId,
        purchaseId,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('data');
      expect(purchaseService.deletePurchase).toBeCalledTimes(1);
    });

    it('4.2 - should throw error provided an invalid purchase id', async () => {
      // Arrange
      const purchaseId = '';
      jest.spyOn(purchaseService, 'deletePurchase').mockResolvedValueOnce(null);

      // Act
      const result = purchaseController.deletePurchase(userId, purchaseId);

      // Assert
      expect(result).rejects.toThrow();
      expect(purchaseService.deletePurchase).toBeCalledTimes(1);
    });
  });
});
