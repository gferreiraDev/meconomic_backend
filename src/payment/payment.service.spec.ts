import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { DatabaseService } from '../database/database.service';
import { ReserveService } from '../reserve/reserve.service';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let databaseService: DatabaseService;
  let reserveService: ReserveService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const transactionMock = {
    id: '5818b139-2a52-443a-bae9-5c2127575h87',
    type: 'DF',
    category: 'Alimentação',
    subcategory: '',
    description: 'Despesa Supermercado',
    value: 650.0,
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
  const paymentMock = {
    value: 650.0,
    paymentType: 'withdraw',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionId: '5818b139-2a52-443a-bae9-5c2127575h87',
    reserveId: 'c212b139-2a52-443a-bae9-577a8e575f25',
    transaction: transactionMock,
    reserve: {
      id: 'c212b139-2a52-443a-bae9-577a8e575f25',
      amount: 1500,
      type: 'Conta Corrente',
      description: 'Conta Nubank',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      payments: [],
    },
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: DatabaseService,
          useValue: {
            payment: {
              create: jest.fn().mockResolvedValue(paymentMock),
              findMany: jest.fn().mockResolvedValue([paymentMock]),
            },
          },
        },
        { provide: ReserveService, useValue: { updateReserve: jest.fn() } },
      ],
    }).compile();

    paymentService = testingModule.get<PaymentService>(PaymentService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
    reserveService = testingModule.get<ReserveService>(ReserveService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(paymentService).toBeDefined();
      expect(databaseService).toBeDefined();
      expect(reserveService).toBeDefined();
    });
  });

  describe('1 - Register Payment', () => {
    it('1.1 - should be able to register a payment', async () => {
      // Arrange
      const payData = {
        value: 650.0,
        paymentType: 'withdraw',
        transactionId: '5818b139-2a52-443a-bae9-5c2127575h87',
        reserveId: 'c212b139-2a52-443a-bae9-577a8e575f25',
      };

      // Act
      const result = await paymentService.addPayment(payData);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.payment.create).toBeCalledTimes(1);
      expect(reserveService.updateReserve).toBeCalledTimes(1);
    });

    it('1.2 - should return null provided invalid payment data', async () => {
      // Arrange
      const payData = {
        value: 650.0,
        paymentType: 'withdraw',
        transactionId: '',
        reserveId: '',
      };

      jest
        .spyOn(databaseService['payment'], 'create')
        .mockRejectedValueOnce(null);

      // Act
      const result = await paymentService.addPayment(payData);

      // Assert
      expect(result).toBeNull();
      expect(databaseService.payment.create).toBeCalledTimes(1);
    });
  });

  describe('2 - List Payments', () => {
    it('2.1 - should list all user payments', async () => {
      // Arrange
      const query = {};

      // Act
      const result = await paymentService.listPayments(userId, query);

      // Assert
      expect(result).toBeDefined();
      expect(databaseService.payment.findMany).toBeCalledTimes(1);
    });

    it('2.2 - should return an empty array if no payment found', async () => {
      // Arrange
      const query = {};
      jest
        .spyOn(databaseService['payment'], 'findMany')
        .mockResolvedValueOnce([]);

      // Act
      const result = await paymentService.listPayments(userId, query);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
      expect(databaseService.payment.findMany).toBeCalledTimes(1);
    });
  });
});
