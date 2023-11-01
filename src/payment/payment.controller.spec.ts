import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
  const paymentMock = {
    value: 650.0,
    paymentType: 'withdraw',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactionId: '5818b139-2a52-443a-bae9-5c2127575h87',
    reserveId: 'c212b139-2a52-443a-bae9-577a8e575f25',
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
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            listPayments: jest.fn().mockResolvedValue(paymentMock),
          },
        },
      ],
    }).compile();

    paymentController = testingModule.get<PaymentController>(PaymentController);
    paymentService = testingModule.get<PaymentService>(PaymentService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(paymentController).toBeDefined();
      expect(paymentService).toBeDefined();
    });
  });
});
