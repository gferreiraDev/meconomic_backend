import { Test, TestingModule } from '@nestjs/testing';
import { StatementsService } from './statements.service';
import { TransactionsService } from '../transactions/transactions.service';
import { DatabaseService } from '../database/database.service';

describe('StatementsService', () => {
  let statementService: StatementsService;
  let transactionService: TransactionsService;
  let databaseService: DatabaseService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const statementMock = {
    id: 'ss1',
    type: 'DF',
    category: 'Alimentação',
    subcategory: '',
    description: 'Supermercado',
    expectedValue: 650.0,
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
        StatementsService,
        {
          provide: DatabaseService,
          useValue: {
            statement: {
              create: jest.fn().mockResolvedValue(statementMock),
              findMany: jest.fn().mockResolvedValue([statementMock]),
              update: jest.fn().mockResolvedValue(statementMock),
              delete: jest.fn().mockResolvedValue(statementMock),
            },
            month: {
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            createMany: jest.fn(),
            removeMany: jest.fn(),
          },
        },
      ],
    }).compile();

    statementService = testingModule.get<StatementsService>(StatementsService);
    transactionService =
      testingModule.get<TransactionsService>(TransactionsService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(statementService).toBeDefined();
      expect(transactionService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - Create Transaction', () => {
    it('1.1 - should be able to create a new transaction', async () => {
      // Arrange
      const data = {
        type: 'DF',
        category: 'Alimentação',
        subcategory: '',
        description: 'Supermercado',
        expectedValue: 650.0,
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
      };

      // Act
      const result = await statementService.create(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.statement.create).toBeCalledTimes(1);
      expect(transactionService.createMany).toBeCalledTimes(1);
    });

    it('1.2 - should return null provided an invalid data', async () => {
      // Arrange
      const data = {
        type: '',
        category: '',
        subcategory: '',
        description: '',
        expectedValue: null,
        dueDay: null,
        installments: 0,
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
      };
      jest
        .spyOn(databaseService['statement'], 'create')
        .mockRejectedValueOnce(null);

      // Act
      const result = await statementService.create(userId, data);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.statement.create).toBeCalledTimes(1);
      expect(transactionService.createMany).not.toBeCalled();
    });
  });

  describe('2 - List Statements', () => {
    it('2.1 - should list all statements from an user', async () => {
      // Act
      const result = await statementService.list(userId);

      // Assert
      expect(result).toBeDefined;
      expect(result).toHaveLength(1);
      expect(databaseService.statement.findMany).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Statement', () => {
    it('3.1 - should update an statement', async () => {
      // Arrange
      const update = {
        description: 'Despesa Supermercado',
        expectedValue: 900.0,
      };
      jest
        .spyOn(databaseService['statement'], 'update')
        .mockResolvedValueOnce(Object.assign(statementMock, update));

      // Act
      const result = await statementService.update(
        userId,
        statementMock.id,
        update,
      );
      // Assert
      expect(result).toBeDefined;
      expect(result.description).toEqual(update.description);
      expect(result.expectedValue).toEqual(update.expectedValue);
      expect(databaseService.statement.update).toBeCalledTimes(1);
    });

    it('3.2 - should return null provided an invalid statement id', async () => {
      // Arrange
      const update = {
        description: 'Despesa Supermercado',
        expectedValue: 900.0,
      };
      jest
        .spyOn(databaseService['statement'], 'update')
        .mockRejectedValueOnce(null);

      // Act
      const result = await statementService.update(
        userId,
        statementMock.id,
        update,
      );
      // Assert
      expect(result).toBeNull;
      expect(databaseService.statement.update).toBeCalledTimes(1);
    });
  });

  describe('4 - Delete Statement', () => {
    it('4.1 - should be able to remove a statement', async () => {
      // Arrange
      const statementId = '3ab8f139-2a52-443a-bae9-5c2127575f28';
      jest
        .spyOn(databaseService['statement'], 'delete')
        .mockRejectedValueOnce(null);

      // Act
      const result = await statementService.remove(userId, statementId);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.month.deleteMany).toBeCalledTimes(1);
      expect(transactionService.removeMany).toBeCalledTimes(1);
    });

    it('4.2 - should return null provided an invalid statement id', async () => {
      // Arrange
      const statementId = statementMock.id;

      // Act
      const result = await statementService.remove(userId, statementId);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.month.deleteMany).toBeCalledTimes(1);
      expect(transactionService.removeMany).toBeCalledTimes(1);
    });
  });
});
