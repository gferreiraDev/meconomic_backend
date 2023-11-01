import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const userMock = {};

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(userMock),
            forgotPasword: jest.fn().mockResolvedValue('6eee50f13b99334c'),
            updatePassword: jest.fn().mockResolvedValue(userMock),
            resetPassword: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();

    authController = testingModule.get<AuthController>(AuthController);
    authService = testingModule.get<AuthService>(AuthService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(authController).toBeDefined();
      expect(authService).toBeDefined();
    });
  });
});
