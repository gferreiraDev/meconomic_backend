import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { DatabaseService } from '../database/database.service';
import { PaymentService } from '../payment/payment.service';

describe('TransactionsService', () => {
  let transactionService: TransactionsService;
  let databaseService: DatabaseService;
  let paymentService: PaymentService;

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
  };
  const statementMock = {
    id: '3aa8b139-2a52-443a-bae9-5c2127575f77',
    type: 'DF',
    category: 'Alimentação',
    subcategory: '',
    description: 'Supermercado',
    expectedValue: 950.0,
    dueDay: 10,
    installments: 6,
    months: [
      { month: '1', label: 'Jan', checked: false },
      { month: '2', label: 'Fev', checked: true },
      { month: '3', label: 'Mar', checked: false },
      { month: '4', label: 'Abr', checked: true },
      { month: '5', label: 'Mai', checked: false },
      { month: '6', label: 'Jun', checked: true },
      { month: '7', label: 'Jul', checked: false },
      { month: '8', label: 'Ago', checked: true },
      { month: '9', label: 'Set', checked: false },
      { month: '10', label: 'Out', checked: true },
      { month: '11', label: 'Nov', checked: false },
      { month: '12', label: 'Dez', checked: true },
    ],
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: DatabaseService,
          useValue: {
            transaction: {
              create: jest.fn().mockResolvedValue(transactionMock),
              findMany: jest.fn().mockResolvedValue([transactionMock]),
              findFirst: jest.fn().mockResolvedValue(transactionMock),
              update: jest.fn().mockResolvedValue(transactionMock),
              delete: jest.fn().mockResolvedValue(transactionMock),
              deleteMany: jest.fn().mockResolvedValue([transactionMock]),
              groupBy: jest.fn().mockResolvedValue([
                Object.assign(transactionMock, {
                  _sum: {
                    value: transactionMock.value,
                  },
                }),
              ]),
            },
            statement: {
              findFirst: jest.fn().mockResolvedValue({
                ...statementMock,
                card: {
                  id: 'card-id84-df80g',
                  currentLimit: 0,
                },
              }),
            },
            card: {
              update: jest.fn().mockResolvedValue({
                id: 'card-id84-df80g',
                limit: 1000,
                currentLimit: 0,
              }),
            },
          },
        },
        {
          provide: PaymentService,
          useValue: {
            addPayment: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService =
      testingModule.get<TransactionsService>(TransactionsService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
    paymentService = testingModule.get<PaymentService>(PaymentService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(transactionService).toBeDefined();
      expect(databaseService).toBeDefined();
      expect(paymentService).toBeDefined();
    });
  });

  describe('1 - Create Transaction', () => {
    it('1.1 - should be able to create many transactions', async () => {
      // Act
      const result = await transactionService.createMany(statementMock);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.transaction.create).toBeCalledTimes(6);
    });

    it('1.2 - should be able to crete a single transaction', async () => {
      // Arrange
      const data = {
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
      const result = await transactionService.create(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.transaction.create).toBeCalledTimes(1);
    });

    it('1.3 - should return null provided an invalid data', async () => {
      // Arrange
      const data = {
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
      jest
        .spyOn(databaseService['transaction'], 'create')
        .mockRejectedValueOnce(null);

      // Act
      const result = await transactionService.create(userId, data);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.create).toBeCalledTimes(1);
    });

    it('1.4 - should return null if months are not provided', async () => {
      // Arrange
      const dataMock = {
        ...statementMock,
        months: [],
      };

      // Act
      const result = await transactionService.createMany(dataMock);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.transaction.create).not.toBeCalled();
    });
  });

  describe('2 - List Transactions', () => {
    it('2.1 - should be able to list all user transactions', async () => {
      // Act
      const result = await transactionService.list(userId, { dueDate: null });

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('transactions');
      // expect(result.transactions).toHaveLength(1);
      expect(databaseService.transaction.findMany).toBeCalledTimes(1);
    });

    it('2.2 - should return an empty array if transaction not found', async () => {
      // Arrange
      jest
        .spyOn(databaseService['transaction'], 'findMany')
        .mockResolvedValueOnce([]);

      // Act
      const result = await transactionService.list(userId, {});

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('transactions');
      expect(result.transactions).toHaveLength(0);
      expect(databaseService.transaction.findMany).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Transaction', () => {
    it('3.1 - should update a single transaction', async () => {
      // Arrange
      const update = {};
      const transactionId = '3aa8b139-2a52-443a-bae9-5c2127575f77';
      jest
        .spyOn(databaseService['transaction'], 'update')
        .mockResolvedValueOnce(Object.assign(transactionMock, update));

      // Act
      const result = await transactionService.update(
        userId,
        transactionId,
        update,
      );

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.transaction.findFirst).toBeCalledTimes(1);
      expect(databaseService.transaction.update).toBeCalledTimes(1);
    });

    it('3.2 - should return null if transaction not found', async () => {
      // Arrange
      const transactionId = 'any-inv4211dW-1D';
      const data = {
        descrition: 'updated description',
        value: 300.99,
      };

      jest
        .spyOn(databaseService['transaction'], 'findFirst')
        .mockResolvedValueOnce(null);

      // Act
      const result = await transactionService.update(
        userId,
        transactionId,
        data,
      );

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.findFirst).toBeCalledTimes(1);
    });

    it('3.3 - should return null provided an invalid data', async () => {
      // Arrange
      const transactionId = '5818b139-2a52-443a-bae9-5c2127575h87';
      const data = {};

      jest
        .spyOn(databaseService['transaction'], 'findFirst')
        .mockRejectedValueOnce(null);

      // Act
      const result = await transactionService.update(
        userId,
        transactionId,
        data,
      );

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.findFirst).toBeCalledTimes(1);
    });
  });

  describe('4 - Remove One Transaction', () => {
    it('4.1 - should remove a single transaction', async () => {
      // Arrange
      const transactionId = '3aa8b139-2a52-443a-bae9-5c2127575f77';

      // Act
      const result = await transactionService.remove(userId, transactionId);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.transaction.delete).toBeCalledTimes(1);
    });

    it('4.2 - should return null provided an invalid transaction id', async () => {
      // Arrange
      const transactionId = null;
      jest
        .spyOn(databaseService['transaction'], 'delete')
        .mockRejectedValueOnce(null);

      // Act
      const result = await transactionService.remove(userId, transactionId);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.delete).toBeCalledTimes(1);
    });

    it('4.3 - should return null if transaction not found', async () => {
      // Arrange
      const transactionId = '3aa8b139-2a52-443a-bae9-5c2127575f77';
      jest
        .spyOn(databaseService['transaction'], 'delete')
        .mockResolvedValueOnce(null);

      // Act
      const result = await transactionService.remove(userId, transactionId);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.delete).toBeCalledTimes(1);
    });
  });

  describe('5 - Remove Many Transactions', () => {
    it('5.1 - should be able to remove many transactions at once', async () => {
      // Arrange
      const statementId = '5dw8b139-2a52-443a-bae9-5c21275754dd';

      // Act
      const result = await transactionService.removeMany(userId, statementId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(databaseService.transaction.deleteMany).toBeCalledTimes(1);
    });

    it('5.2 - should return null if transactions are not found', async () => {
      // Arrange
      const statementId = '5dw8b139-2a52-443a-bae9-5c21275754dd';
      jest
        .spyOn(databaseService['transaction'], 'deleteMany')
        .mockRejectedValueOnce(null);

      // Act
      const result = await transactionService.removeMany(userId, statementId);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.deleteMany).toBeCalledTimes(1);
    });
  });

  describe('6 - Register Transaction Payment', () => {
    it('6.1 - should be able to register a transaction payment', async () => {
      // Arrange
      const update = {
        id: '3aa8b139-2a52-443a-bae9-5c2127575f77',
        category: 'Alimentação',
        value: 129.99,
        status: 'Quitado',
      };
      jest
        .spyOn(databaseService['transaction'], 'update')
        .mockResolvedValueOnce(Object.assign(transactionMock, update));

      // Act
      const result = await transactionService.registerPayment(userId, update);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.transaction.update).toBeCalledTimes(1);
      expect(paymentService.addPayment).toBeCalledTimes(1);
    });

    it('6.2 - should return null provided an invalid update data', async () => {
      // Arrange
      const update = {
        id: null,
      };
      jest
        .spyOn(databaseService['transaction'], 'update')
        .mockRejectedValueOnce(null);

      // Act
      const result = await transactionService.registerPayment(userId, update);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.update).toBeCalledTimes(1);
      expect(paymentService.addPayment).not.toBeCalled();
    });

    it('6.3 - should return null if transaction was not found', async () => {
      // Arrange
      const update = {
        id: '3aa8b139-2a52-443a-bae9-5c2127575f77',
        category: 'Alimentação',
        value: 129.99,
      };
      jest
        .spyOn(databaseService['transaction'], 'update')
        .mockRejectedValueOnce(null);

      // Act
      const result = await transactionService.registerPayment(userId, update);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.transaction.update).toBeCalledTimes(1);
      expect(paymentService.addPayment).not.toBeCalled();
    });

    it('6.4 - should trigger card limit restoration if card invoice', async () => {
      // Arrange
      const update = {
        id: '3aa8b139-2a52-443a-bae9-5c2127575f77',
        category: 'Fatura Cartão',
        value: 1250.99,
        status: 'Quitado',
      };

      jest
        .spyOn(databaseService['transaction'], 'update')
        .mockResolvedValueOnce(Object.assign(transactionMock, update));

      // Act
      const result = await transactionService.registerPayment(userId, update);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.transaction.update).toBeCalledTimes(1);
      expect(paymentService.addPayment).toBeCalledTimes(1);
      expect(databaseService.statement.findFirst).toBeCalledTimes(1);
      expect(databaseService.card.update).toBeCalledTimes(1);
    });
  });
});
