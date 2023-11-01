import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let transactionController: TransactionsController;
  let transactionService: TransactionsService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const transactionMock = {
    id: '5818b139-2a52-443a-bae9-5c2127575h87',
    type: 'DF',
    category: 'Alimentação',
    subcategory: '',
    description: 'Despesa Supermercado',
    value: 900.0,
    dueDate: new Date(),
    payDate: new Date(),
    installments: 6,
    installment: 1,
    status: 'Pendente',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
    statementId: '3fa8b139-3b63-443a-bae9-5c2127575f25',
    reserveId: null,
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(transactionMock),
            list: jest.fn().mockResolvedValue([transactionMock]),
            registerPayment: jest.fn().mockResolvedValue(transactionMock),
            update: jest.fn().mockResolvedValue(transactionMock),
            remove: jest.fn().mockResolvedValue(transactionMock),
          },
        },
      ],
    }).compile();

    transactionController = testingModule.get<TransactionsController>(
      TransactionsController,
    );
    transactionService =
      testingModule.get<TransactionsService>(TransactionsService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(transactionController).toBeDefined();
      expect(transactionService).toBeDefined();
    });
  });

  describe('1 - Create Transaction', () => {
    it('1.1 - should be able to create a single transaction', async () => {
      // Arrange
      const transactionData = {
        type: 'DF',
        category: 'Alimentação',
        subcategory: '',
        description: 'Despesa Supermercado',
        value: 900.0,
        dueDate: new Date(),
        payDate: new Date(),
        installments: 6,
        installment: 1,
        status: 'Pendente',
        reserveId: null,
      };

      // Act
      const result = await transactionController.createTransaction(
        userId,
        transactionData,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(transactionService.create).toBeCalledTimes(1);
    });

    it('1.2 - should throw error provided invalid data', async () => {
      // Arrange
      const transactionData = {
        type: '',
        category: '',
        subcategory: '',
        description: '',
        value: 0,
        dueDate: new Date(),
        payDate: new Date(),
        installments: 1,
        installment: 1,
        status: '',
        reserveId: null,
      };
      jest.spyOn(transactionService, 'create').mockResolvedValueOnce(null);

      // Act
      const result = transactionController.createTransaction(
        userId,
        transactionData,
      );

      // Assert
      expect(result).rejects.toThrow();
      expect(transactionService.create).toBeCalledTimes(1);
    });
  });

  describe('2 - List Payments', () => {
    it('2.1 - should return an user transactions', async () => {
      // Arrange
      const query = {};

      // Act
      const result = await transactionController.listTransactions(
        userId,
        query,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(1);
      expect(transactionService.list).toBeCalledTimes(1);
    });

    it('2.2 - should return an empty array if no transaction found', async () => {
      // Arrange
      const query = {};
      jest.spyOn(transactionService, 'list').mockResolvedValueOnce([]);

      // Act
      const result = await transactionController.listTransactions(
        userId,
        query,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(0);
      expect(transactionService.list).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Transaction', () => {
    it('3.1 - should be able to update a single transaction', async () => {
      // Arrange
      const update = {};
      jest
        .spyOn(transactionService, 'update')
        .mockResolvedValueOnce(Object.assign(transactionMock, update));

      // Act
      const result = await transactionController.updateTransaction(
        userId,
        transactionMock.id,
        update,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(transactionService.update).toBeCalledTimes(1);
    });

    it('3.2 - should throw error provided an invalid transaction id', async () => {
      // Arrange
      const update = {};
      jest.spyOn(transactionService, 'update').mockResolvedValueOnce(null);

      // Act
      const result = transactionController.updateTransaction(
        userId,
        transactionMock.id,
        update,
      );

      // Assert
      expect(result).rejects.toThrow();
      expect(transactionService.update).toBeCalledTimes(1);
    });
  });

  describe('4 - Delete Transaction', () => {
    it('4.1 - should successfuly remove a transaction', async () => {
      // Act
      const result = await transactionController.deleteTransaction(
        userId,
        transactionMock.id,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(transactionService.remove).toBeCalledTimes(1);
    });

    it('4.2 - should throw error provided an invalid id', async () => {
      // Arrange
      jest.spyOn(transactionService, 'remove').mockResolvedValueOnce(null);

      // Act
      const result = transactionController.deleteTransaction(
        userId,
        transactionMock.id,
      );

      // Assert
      expect(result).rejects.toThrow();
      expect(transactionService.remove).toBeCalledTimes(1);
    });
  });

  describe('5 - Register Payment', () => {
    it('5.1 - should be able to register a transaction payment', async () => {
      // Arrange
      const update = {
        id: '3aa8b139-2a52-443a-bae9-5c2127575f77',
        category: 'Alimentação',
        value: 129.99,
        status: 'Quitado',
      };

      // Act
      const result = await transactionController.registerPayment(
        userId,
        update,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(transactionService.registerPayment).toBeCalledTimes(1);
    });

    it('5.2 - should throw error provided an invalid id', async () => {
      // Arrange
      const update = {
        id: '3aa8b139-2a52-443a-bae9-5c2127575f77',
        category: 'Alimentação',
        value: 129.99,
        status: 'Quitado',
      };
      jest
        .spyOn(transactionService, 'registerPayment')
        .mockResolvedValueOnce(null);

      // Act
      const result = transactionController.registerPayment(userId, update);

      // Assert
      expect(result).rejects.toThrow();
      expect(transactionService.registerPayment).toBeCalledTimes(1);
    });
  });
});
