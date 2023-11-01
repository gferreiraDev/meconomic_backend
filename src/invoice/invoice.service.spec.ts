import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { DatabaseService } from '../database/database.service';

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;
  let databaseService: DatabaseService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const mockResult = [
    {
      id: '54e7v897-2a51-444d-bae9-5c2127578w89',
      currentInstallment: 1,
      currentValue: 189.99,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: DatabaseService,
          useValue: {
            purchaseInstallment: {
              findMany: jest.fn().mockResolvedValue(mockResult),
            },
          },
        },
      ],
    }).compile();

    invoiceService = module.get<InvoiceService>(InvoiceService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(invoiceService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - List Invoice Purchases', () => {
    it('1.1 - should return a list of purchases', async () => {
      // Arrange
      const data = {
        cardId: '',
        dueDate: new Date(),
      };

      // Act
      const result = await invoiceService.listInvoicePurchases(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(databaseService.purchaseInstallment.findMany).toBeCalledTimes(1);
    });

    it('1.2 - should return an empty list if no purchases found', async () => {
      // Arrange
      const data = {
        cardId: '',
        dueDate: new Date(),
      };
      jest
        .spyOn(databaseService['purchaseInstallment'], 'findMany')
        .mockResolvedValueOnce([]);

      // Act
      const result = await invoiceService.listInvoicePurchases(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(databaseService.purchaseInstallment.findMany).toBeCalledTimes(1);
    });
  });
});
