import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let invoiceController: InvoiceController;
  let invoiceService: InvoiceService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const mockResult = {
    id: '54e7v897-2a51-444d-bae9-5c2127578w89',
    currentInstallment: 1,
    currentValue: 189.99,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            listInvoicePurchases: jest.fn().mockResolvedValue([mockResult]),
          },
        },
      ],
    }).compile();

    invoiceController = testingModule.get<InvoiceController>(InvoiceController);
    invoiceService = testingModule.get<InvoiceService>(InvoiceService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(invoiceController).toBeDefined();
      expect(invoiceService).toBeDefined();
    });
  });

  describe('1 - List Invoice Items', () => {
    it('1.1 - should return a list of invoice items', async () => {
      // Arrange
      const data = {
        cardId: '',
        dueDate: new Date(),
      };

      // Act
      const result = await invoiceController.listInvoiceItems(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(1);
      expect(invoiceService.listInvoicePurchases).toBeCalledTimes(1);
    });

    it('1.2 - should return an empty list if no item was found', async () => {
      // Arrange
      const data = {
        cardId: '',
        dueDate: new Date(),
      };

      jest
        .spyOn(invoiceService, 'listInvoicePurchases')
        .mockResolvedValueOnce([]);

      // Act
      const result = await invoiceController.listInvoiceItems(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(0);
      expect(invoiceService.listInvoicePurchases).toBeCalledTimes(1);
    });
  });
});
