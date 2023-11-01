import { Test, TestingModule } from '@nestjs/testing';
import { ReserveController } from './reserve.controller';
import { ReserveService } from './reserve.service';

describe('ReserveController', () => {
  let reserveController: ReserveController;
  let reserveService: ReserveService;

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
      controllers: [ReserveController],
      providers: [
        {
          provide: ReserveService,
          useValue: {
            addReserve: jest.fn().mockResolvedValue(reserveMock),
            listReserves: jest.fn().mockResolvedValue([reserveMock]),
            updateReserve: jest.fn().mockResolvedValue(reserveMock),
            deleteReserve: jest.fn().mockResolvedValue(reserveMock),
          },
        },
      ],
    }).compile();

    reserveController = testingModule.get<ReserveController>(ReserveController);
    reserveService = testingModule.get<ReserveService>(ReserveService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(reserveController).toBeDefined();
      expect(reserveService).toBeDefined();
    });
  });

  describe('1 - Create Reserve', () => {
    it('1.1 - should create a reserve', async () => {
      // Arrange
      const data = {
        amount: 300,
        type: 'Conta Corrente',
        description: 'Conta Nubank',
      };

      // Act
      const result = await reserveController.create(userId, data);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(reserveService.addReserve).toBeCalledTimes(1);
    });

    it('1.2 - should throw error provided an invalid data', async () => {
      // Arrange
      const data = {
        amount: 0,
        type: '',
        description: '',
      };

      jest.spyOn(reserveService, 'addReserve').mockResolvedValueOnce(null);

      // Act
      const result = reserveController.create(userId, data);

      // Assert
      expect(result).rejects.toThrow();
      expect(reserveService.addReserve).toBeCalledTimes(1);
    });
  });

  describe('2 - List Reserves', () => {
    it('2.1 - should list all user reserves', async () => {
      // Act
      const result = await reserveController.list(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(1);
      expect(reserveService.listReserves).toBeCalledTimes(1);
    });
  });

  describe('3 - Update Reserve', () => {
    it('3.1 - should be able to update a reserve', async () => {
      // Arrange
      const reserveId = 'c212b139-2a52-443a-bae9-577a8e575f25';
      const update = {
        type: 'Carteira',
        description: 'Minha carteira',
        amount: 1250,
      };

      jest
        .spyOn(reserveService, 'updateReserve')
        .mockResolvedValueOnce(Object.assign(reserveMock, update));

      // Act
      const result = await reserveController.update(userId, reserveId, update);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('data');
      expect(reserveService.updateReserve).toBeCalledTimes(1);
    });

    it('3.2 - should throw error provided an invalid reserve id', async () => {
      // Arrange
      const reserveId = '';
      const update = {
        type: 'Carteira',
        description: 'Minha carteira',
        amount: 1250,
      };

      jest.spyOn(reserveService, 'updateReserve').mockResolvedValueOnce(null);

      // Act
      const result = reserveController.update(userId, reserveId, update);

      // Assert
      expect(result).rejects.toThrow();
      expect(reserveService.updateReserve).toBeCalledTimes(1);
    });
  });

  describe('4 - Delete Reserve', () => {
    it('4.1 - should be able to delete a reserve', async () => {
      // Arrange
      const reserveId = 'c212b139-2a52-443a-bae9-577a8e575f25';

      // Act
      const result = await reserveController.remove(userId, reserveId);

      // Assert
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('data');
      expect(reserveService.deleteReserve).toBeCalledTimes(1);
    });

    it('4.2 - should throw error provided an invalid reserve id', async () => {
      // Arrange
      const reserveId = '';
      jest.spyOn(reserveService, 'deleteReserve').mockResolvedValueOnce(null);

      // Act
      const result = reserveController.remove(userId, reserveId);

      // Assert
      expect(result).rejects.toThrow();
      expect(reserveService.deleteReserve).toBeCalledTimes(1);
    });
  });
});
