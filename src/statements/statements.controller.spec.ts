import { Test, TestingModule } from '@nestjs/testing';
import { StatementsController } from './statements.controller';
import { StatementsService } from './statements.service';

describe('StatementsController', () => {
  let statementController: StatementsController;
  let statementService: StatementsService;

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
      controllers: [StatementsController],
      providers: [
        {
          provide: StatementsService,
          useValue: {
            create: jest.fn().mockResolvedValue(statementMock),
            list: jest.fn().mockResolvedValue(statementMock),
            update: jest.fn().mockResolvedValue(statementMock),
            remove: jest.fn().mockResolvedValue(statementMock),
          },
        },
      ],
    }).compile();

    statementController =
      testingModule.get<StatementsController>(StatementsController);
    statementService = testingModule.get<StatementsService>(StatementsService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(statementController).toBeDefined();
      expect(statementService).toBeDefined();
    });
  });

  describe('1 - Create Statement', () => {
    it('1.1 - should be able to create a new statement', async () => {
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
      const result = await statementController.createStatement(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(statementService.create).toBeCalledTimes(1);
    });

    it('1.2 - should throw error provided an invalid data', async () => {
      // Arrange
      const data = {
        type: '',
        category: '',
        subcategory: '',
        description: '',
        expectedValue: 0.0,
        dueDay: null,
        installments: null,
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
      jest.spyOn(statementService, 'create').mockResolvedValueOnce(null);

      // Act
      const result = statementController.createStatement(userId, data);

      // Assert
      expect(result).rejects.toThrow();
      expect(statementService.create).toBeCalledTimes(1);
    });
  });

  describe('2 - List Statements', () => {
    it('2.1 - should list all user statements', async () => {
      // Act
      const result = await statementController.listStatements(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(statementService.list).toBeCalledTimes(1);
    });

    it('2.1 - should return an empty list if no statement was found', async () => {
      // Arrange
      jest.spyOn(statementService, 'list').mockResolvedValueOnce([]);

      // Act
      const result = await statementController.listStatements(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(statementService.list).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Statement', () => {
    it('3.1 - should update a statement provided valid data', async () => {
      // Arrange
      const userId = statementMock.userId;
      const statementId = statementMock.id;
      const update = {
        description: 'Despesa Supermercado',
        expectedValue: 900.0,
      };
      jest
        .spyOn(statementService, 'update')
        .mockResolvedValueOnce(Object.assign(statementMock, update));

      // Act
      const result = await statementController.updateStatement(
        userId,
        statementId,
        update,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.data.description).toEqual(update.description);
      expect(result.data.expectedValue).toEqual(update.expectedValue);
      expect(statementService.update).toBeCalledTimes(1);
    });

    it('3.2 - should throw error provided invalid data', async () => {
      // Arrange
      const userId = statementMock.userId;
      const statementId = statementMock.id;
      const update = {
        description: '',
        expectedValue: 0,
      };
      jest.spyOn(statementService, 'update').mockResolvedValueOnce(null);

      // Act
      const result = statementController.updateStatement(
        userId,
        statementId,
        update,
      );

      // Assert
      expect(result).rejects.toThrow();
      expect(statementService.update).toBeCalledTimes(1);
    });

    it('3.3 - should throw error provided invalid statement id', async () => {
      // Arrange
      const userId = 'invalidid3541';
      const statementId = statementMock.id;
      const update = {
        description: 'Despesa Supermercado',
        expectedValue: 900.0,
      };
      jest.spyOn(statementService, 'update').mockResolvedValueOnce(null);

      // Act
      const result = statementController.updateStatement(
        userId,
        statementId,
        update,
      );

      // Assert
      expect(result).rejects.toThrow();
      expect(statementService.update).toBeCalledTimes(1);
    });
  });

  describe('4 - Delete Statement', () => {
    it('3.1 - should delete a statement provided valid id', async () => {
      // Arrange
      const userId = statementMock.userId;
      const statementId = statementMock.id;

      // Act
      const result = await statementController.deleteStatement(
        userId,
        statementId,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('message');
      expect(result.message).toEqual('Registro excluído com sucesso');
      expect(statementService.remove).toBeCalledTimes(1);
    });

    it('3.2 - should throw error provided an invalid id', async () => {
      // Arrange
      const userId = statementMock.userId;
      const statementId = statementMock.id;
      jest.spyOn(statementService, 'remove').mockResolvedValueOnce(null);

      // Act
      const result = statementController.deleteStatement(userId, statementId);

      // Assert
      expect(result).rejects.toThrow();
      expect(statementService.remove).toBeCalledTimes(1);
    });
  });
});
