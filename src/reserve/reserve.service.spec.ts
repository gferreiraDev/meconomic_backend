import { Test, TestingModule } from '@nestjs/testing';
import { ReserveService } from './reserve.service';
import { DatabaseService } from '../database/database.service';

describe('ReserveService', () => {
  let reserveService: ReserveService;
  let databaseService: DatabaseService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const reserveMock = {
    id: 'c212b139-2a52-443a-bae9-577a8e575f25',
    amount: 300,
    type: 'Conta Corrente',
    description: 'Conta Nubank',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
    payments: [],
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ReserveService,
        {
          provide: DatabaseService,
          useValue: {
            reserve: {
              create: jest.fn().mockResolvedValue(reserveMock),
              findMany: jest.fn().mockResolvedValue([reserveMock]),
              update: jest.fn().mockResolvedValue(reserveMock),
              delete: jest.fn().mockResolvedValue(reserveMock),
            },
          },
        },
      ],
    }).compile();

    reserveService = testingModule.get<ReserveService>(ReserveService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(reserveService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - Create Reserve', () => {
    it('1.1 - should be able to create a reserve', async () => {
      // Arrange
      const data = {
        amount: 300,
        type: 'Conta Corrente',
        description: 'Conta Nubank',
      };

      // Act
      const result = await reserveService.addReserve(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.reserve.create).toBeCalledTimes(1);
    });

    it('1.2 - should return null provided invalid data', async () => {
      // Arrange
      const data = {
        amount: 0,
        type: '',
        description: '',
      };

      jest
        .spyOn(databaseService['reserve'], 'create')
        .mockRejectedValueOnce(null);

      // Act
      const result = await reserveService.addReserve(userId, data);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.reserve.create).toBeCalledTimes(1);
    });
  });

  describe('2 - List Reserves', () => {
    it('2.1 - should list all user reserves', async () => {
      // Act
      const result = await reserveService.listReserves(userId);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.reserve.findMany).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Reserve', () => {
    it('3.1 - should update reserve', async () => {
      // Arrange
      const reserveId = 'c212b139-2a52-443a-bae9-577a8e575f25';
      const update = {
        amount: 1250,
      };

      jest
        .spyOn(databaseService['reserve'], 'update')
        .mockResolvedValueOnce(Object.assign(reserveMock, update));

      // Act
      const result = await reserveService.updateReserve(
        userId,
        reserveId,
        update,
      );

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.reserve.update).toBeCalledTimes(1);
    });

    it('3.2 - should return null provided an invalid reserve id', async () => {
      // Arrange
      const reserveId = '';
      const update = {
        amount: 1250,
      };

      jest
        .spyOn(databaseService['reserve'], 'update')
        .mockRejectedValueOnce(null);

      // Act
      const result = await reserveService.updateReserve(
        userId,
        reserveId,
        update,
      );

      // Assert
      expect(result).toBeNull();
      expect(databaseService.reserve.update).toBeCalledTimes(1);
    });
  });

  describe('4 - Delete Reserve', () => {
    it('4.1 - should be able to remove a reserve', async () => {
      // Arrange
      const reserveId = 'c212b139-2a52-443a-bae9-577a8e575f25';

      // Act
      const result = await reserveService.deleteReserve(userId, reserveId);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.reserve.delete).toBeCalledTimes(1);
    });

    it('4.2 - should return null provided an invalid id', async () => {
      // Arrange
      const reserveId = '';
      jest
        .spyOn(databaseService['reserve'], 'delete')
        .mockRejectedValueOnce(null);

      // Act
      const result = await reserveService.deleteReserve(userId, reserveId);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.reserve.delete).toBeCalledTimes(1);
    });
  });
});
