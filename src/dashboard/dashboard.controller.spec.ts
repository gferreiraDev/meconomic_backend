import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let dashboardController: DashboardController;
  let dashboardService: DashboardService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const dashboardMock = {
    labels: [
      '11/1/2023',
      '12/1/2023',
      '1/1/2024',
      '2/1/2024',
      '3/1/2024',
      '4/1/2024',
      '5/1/2024',
      '6/1/2024',
      '7/1/2024',
      '8/1/2024',
      '9/1/2024',
      '10/1/2024',
    ],
    incomes: [
      '2500.00',
      '2730.00',
      '2500.00',
      '2500.00',
      '2500.00',
      '2500.00',
      '2500.00',
      '0.00',
      '2500.00',
      '2500.00',
      '5650.00',
      '2500.00',
    ],
    expenses: [
      '188.75',
      '838.75',
      '77.50',
      '727.50',
      '77.50',
      '930.92',
      '77.50',
      '727.50',
      '77.50',
      '727.50',
      '77.50',
      '838.75',
    ],
    result: [
      '2311.25',
      '1891.25',
      '2422.50',
      '1772.50',
      '2422.50',
      '1569.08',
      '2422.50',
      '-727.50',
      '2422.50',
      '1772.50',
      '5572.50',
      '1661.25',
    ],
    totalDF: [0, 650, 0, 650, 0, 650, 0, 650, 0, 650, 0, 650],
    totalDV: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalDA: [
      188.75, 188.75, 77.5, 77.5, 77.5, 280.92, 77.5, 77.5, 77.5, 77.5, 77.5,
      188.75,
    ],
    totalRF: [
      2500, 2500, 2500, 2500, 2500, 2500, 2500, 0, 2500, 2500, 5000, 2500,
    ],
    totalRV: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalRA: [0, 230, 0, 0, 0, 0, 0, 0, 0, 0, 650, 0],
    totalIncomes: 30880,
    totalExpenses: 5367.17,
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getData: jest.fn().mockResolvedValue(dashboardMock),
          },
        },
      ],
    }).compile();

    dashboardController =
      testingModule.get<DashboardController>(DashboardController);
    dashboardService = testingModule.get<DashboardService>(DashboardService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(dashboardController).toBeDefined();
      expect(dashboardService).toBeDefined();
    });
  });

  describe('1 - Get Data', () => {
    it('1.1 - should return an user dashboard data', async () => {
      // Act
      const result = await dashboardController.getDashboardData(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toEqual(dashboardMock);
      expect(dashboardService.getData).toBeCalledTimes(1);
    });
  });
});
