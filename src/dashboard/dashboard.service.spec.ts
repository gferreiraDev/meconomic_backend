import { DatabaseService } from '../database/database.service';
import { DashboardService } from './dashboard.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let databaseService: DatabaseService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const transactionMock = [
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h87',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2023-11-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h88',
      type: 'DA',
      value: 188.75,
      dueDate: new Date('2023-12-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h89',
      type: 'DA',
      value: 188.75,
      dueDate: new Date('2024-01-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h86',
      type: 'DA',
      value: 188.75,
      dueDate: new Date('2024-02-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h85',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2024-03-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h84',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2024-04-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h83',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2024-05-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h82',
      type: 'DA',
      value: 280.92,
      dueDate: new Date('2024-06-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h81',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2024-07-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h80',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2024-08-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h90',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2024-09-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127575h91',
      type: 'DA',
      value: 77.5,
      dueDate: new Date('2024-10-20'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127572f88',
      type: 'DF',
      value: 650.0,
      dueDate: new Date('2023-12-15'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127572f89',
      type: 'DF',
      value: 650.0,
      dueDate: new Date('2024-02-15'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127572f90',
      type: 'DF',
      value: 650.0,
      dueDate: new Date('2024-04-15'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127572f91',
      type: 'DF',
      value: 650.0,
      dueDate: new Date('2024-06-15'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127572f92',
      type: 'DF',
      value: 650.0,
      dueDate: new Date('2024-08-15'),
    },
    {
      id: '5818b139-2a52-443a-bae9-5c2127572f93',
      type: 'DF',
      value: 650.0,
      dueDate: new Date('2024-10-15'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty51',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2023-12-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty52',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-01-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty53',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-02-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty54',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-03-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty55',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-04-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty56',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-05-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty57',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-06-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty58',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-07-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty59',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-09-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty60',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-10-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty61',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-11-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0ty62',
      type: 'RF',
      value: 2500,
      dueDate: new Date('2024-11-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl4d7wa',
      type: 'RA',
      value: 650,
      dueDate: new Date('2023-11-06'),
    },
    {
      id: '4s8rs00s-8e22-m7wa-10gw-q9s2r1fl0b8s1',
      type: 'RA',
      value: 230,
      dueDate: new Date('2024-02-20'),
    },
  ];

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: DatabaseService,
          useValue: {
            transaction: {
              findMany: jest.fn().mockResolvedValue(transactionMock),
            },
          },
        },
      ],
    }).compile();

    dashboardService = testingModule.get<DashboardService>(DashboardService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(dashboardService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - Generate Month List', () => {
    it('1.1 - should return a user dashboard resume', async () => {
      // Act
      const result = await dashboardService.getData(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('labels');
      expect(result.labels).toHaveLength(12);
      expect(result).toHaveProperty('incomes');
      expect(result).toHaveProperty('expenses');
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('totalDF');
      expect(result).toHaveProperty('totalDV');
      expect(result).toHaveProperty('totalDA');
      expect(result).toHaveProperty('totalRF');
      expect(result).toHaveProperty('totalRV');
      expect(result).toHaveProperty('totalRA');
      expect(result).toHaveProperty('totalIncomes');
      expect(result).toHaveProperty('totalExpenses');
    });

    it('1.2 - should return a nullable resume if no value found', async () => {
      // Arrange
      jest
        .spyOn(databaseService['transaction'], 'findMany')
        .mockResolvedValueOnce([]);

      // Act
      const result = await dashboardService.getData(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('labels');
      expect(result.labels).toHaveLength(12);
      expect(result).toHaveProperty('incomes');
      expect(result).toHaveProperty('expenses');
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('totalDF');
      expect(result).toHaveProperty('totalDV');
      expect(result).toHaveProperty('totalDA');
      expect(result).toHaveProperty('totalRF');
      expect(result).toHaveProperty('totalRV');
      expect(result).toHaveProperty('totalRA');
      expect(result).toHaveProperty('totalIncomes');
      expect(result.totalIncomes).toEqual(0);
      expect(result).toHaveProperty('totalExpenses');
      expect(result.totalExpenses).toEqual(0);
    });
  });
});
