import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SendgridService } from '../services/sendgrid/sendgrid.service';
import { TwilioService } from '../services/twilio/twilio.service';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let userService: UserService;
  let jwtService: JwtService;
  let sendgridService: SendgridService;
  let twilioService: TwilioService;
  let databaseService: DatabaseService;

  const userMock = {
    id: '3aa8b139-2a52-443a-bae9-5c2127575f25',
    firstName: 'Amanda',
    lastName: 'Jones',
    email: 'amanda.jones88@provider.com',
    document: '234.567.890-12',
    phone: '(11) 98765-4320',
    resetToken: null,
    isValidated: true,
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$YyfBR0ciLZc3DsvZr/XIDg$77ZgNufwVRvzzqXg1yw/ufg78qFnee+UlujNOHfyrss',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AuthService,
        JwtService,
        {
          provide: UserService,
          useValue: {
            find: jest.fn().mockResolvedValue(userMock),
            create: jest.fn().mockResolvedValue(userMock),
            update: jest.fn().mockResolvedValue(userMock),
          },
        },
        {
          provide: SendgridService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: TwilioService,
          useValue: {
            sendSMS: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn().mockResolvedValue(userMock),
              create: jest.fn().mockResolvedValue(userMock),
              update: jest.fn().mockResolvedValue(userMock),
              delete: jest.fn().mockResolvedValue(userMock),
            },
          },
        },
      ],
    }).compile();

    configService = testingModule.get<ConfigService>(ConfigService);
    authService = testingModule.get<AuthService>(AuthService);
    userService = testingModule.get<UserService>(UserService);
    jwtService = testingModule.get<JwtService>(JwtService);
    sendgridService = testingModule.get<SendgridService>(SendgridService);
    twilioService = testingModule.get<TwilioService>(TwilioService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(configService).toBeDefined();
      expect(authService).toBeDefined();
      expect(userService).toBeDefined();
      expect(jwtService).toBeDefined();
      expect(sendgridService).toBeDefined();
      expect(twilioService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - Validate User', () => {
    it('1.1 - should validate an exhisting user provided a valid data', async () => {
      // Arrange
      const email = 'amanda.jones88@provider.com';
      const password = 'pass@123';

      // Act
      const user = await authService.validate(email, password);

      // Assert
      expect(user).toBeDefined();
      expect(userService.find).toBeCalledTimes(1);
    });

    it('1.2 - should return null if password dont match', async () => {
      // Arrange
      const email = 'amanda.jones88@provider.com';
      const password = 'pass123';

      // Act
      const user = await authService.validate(email, password);

      // Assert
      expect(user).toBeNull();
      expect(userService.find).toBeCalledTimes(1);
    });

    it('1.3 - should return null if user not found', async () => {
      const email = 'amanda.jones88@provider.com';
      const password = 'pass@123';
      jest.spyOn(userService, 'find').mockResolvedValueOnce(null);

      // Act
      const user = await authService.validate(email, password);

      // Assert
      expect(user).toBeNull();
      expect(userService.find).toBeCalledTimes(1);
    });
  });

  describe('2 - Register User', () => {
    it('2.1 - should be able to create a new user', async () => {
      // Arrange
      const userData = {
        firstName: 'Amanda',
        lastName: 'Jones',
        email: 'amanda.jones88@provider.com',
        document: '234.567.890-12',
        phone: '(11) 98765-4320',
        resetToken: null,
        isValidated: true,
        password: 'pass@123',
        confirmPassword: 'pass@123',
        acceptTerms: true,
      };
      jest.spyOn(userService, 'find').mockResolvedValueOnce(null);

      // Act
      const user = await authService.register(userData);

      // Assert
      expect(user).toBeDefined();
      expect(userService.create).toBeCalledTimes(1);
      expect(sendgridService.sendEmail).toBeCalledTimes(1);
    });

    it('2.2 - should prevent creating a duplicated user', async () => {
      // Arrange
      const userData = {
        firstName: 'Amanda',
        lastName: 'Jones',
        email: 'amanda.jones88@provider.com',
        document: '234.567.890-12',
        phone: '(11) 98765-4320',
        resetToken: null,
        isValidated: true,
        password: 'pass@123',
        confirmPassword: 'pass@123',
        acceptTerms: true,
      };
      jest.spyOn(userService, 'create').mockResolvedValueOnce(null);

      // Act
      const user = await authService.register(userData);

      // Assert
      expect(user).toBeNull();
      expect(sendgridService.sendEmail).not.toBeCalled();
    });
  });

  describe('3 - Update Password', () => {
    it('3.1 - should update password provided a valid current password', async () => {
      // Arrange
      const rawPassword = 'pass@123';
      const hashedPassword = bcrypt.hashSync(rawPassword, 10);

      const update = {
        currentPassword: rawPassword,
        password: 'newpass123',
        confirmPassword: 'newpass123',
      };
      // Act
      const user = await authService.updatePassword(
        {
          ...userMock,
          password: hashedPassword,
        },
        update,
      );

      // Arrange
      expect(user).toBeDefined();
      expect(userService.update).toBeCalledTimes(1);
    });

    it('3.2 - should return null provided an invalid current password', async () => {
      // Arrange
      const hashedPassword = bcrypt.hashSync('pass@123', 10);

      const update = {
        currentPassword: 'pass123',
        password: 'newpass123',
        confirmPassword: 'newpass123',
      };

      // Act
      const user = await authService.updatePassword(
        { ...userMock, password: hashedPassword },
        update,
      );

      // Arrange
      expect(user).toBeNull();
      expect(userService.update).not.toBeCalled();
    });
  });

  describe('4 - Forgot Password', () => {
    it('4.1 - should send recovery link provided a valid email', async () => {
      // Arrange
      const userData = {
        email: 'amanda.jones88@provider.com',
        document: '',
      };

      // Act
      const user = await authService.forgotPassword(userData);

      // Assert
      expect(user).toBeDefined();
      expect(userService.find).toBeCalledTimes(1);
      expect(userService.update).toBeCalledTimes(1);
      expect(sendgridService.sendEmail).toBeCalledTimes(1);
      expect(twilioService.sendSMS).toBeCalledTimes(1);
    });

    it('4.2 - should send recovery link provided a valid document', async () => {
      // Arrange
      const userData = {
        email: '',
        document: '234.567.890-12',
      };

      // Act
      const user = await authService.forgotPassword(userData);

      // Assert
      expect(user).toBeDefined();
      expect(userService.find).toBeCalledTimes(1);
      expect(userService.update).toBeCalledTimes(1);
      expect(sendgridService.sendEmail).toBeCalledTimes(1);
      expect(twilioService.sendSMS).toBeCalledTimes(1);
    });

    it('4.3 - should return null provided an invalid data', async () => {
      // Arrange
      const userData = {
        email: '',
        document: '',
      };
      jest.spyOn(userService, 'find').mockResolvedValueOnce(null);

      // Act
      const user = await authService.forgotPassword(userData);

      // Assert
      expect(user).toBeNull();
      expect(userService.find).toBeCalledTimes(1);
      expect(userService.update).not.toBeCalled();
      expect(sendgridService.sendEmail).not.toBeCalled();
      expect(twilioService.sendSMS).not.toBeCalled();
    });
  });

  describe('5 - Reset Password', () => {
    it('5.1 - should reset password provided valid data', async () => {
      // Arrange
      const data = {
        id: userMock.id,
        resetToken: '6eee50f13b99334c',
        password: 'newpassword123',
      };
      jest.spyOn(userService, 'find').mockResolvedValueOnce({
        ...userMock,
        resetToken:
          '$2b$10$ulvBa8hmJERBIPswXJM.gu83W7W2WFPqtAP..xLJWOtOaJV0HrmHi',
      });

      // Act
      const user = await authService.resetPassword(data);

      // Assert
      expect(user).toBeDefined();
      expect(userService.find).toBeCalledTimes(1);
      expect(userService.update).toBeCalledTimes(1);
    });

    it('5.2 - should return null provided invalid data', async () => {
      // Arrange
      const data = {
        id: userMock.id,
        resetToken: '6eee50f13b99334c',
        password: 'newpassword123',
      };
      jest.spyOn(userService, 'find').mockResolvedValueOnce({
        ...userMock,
        resetToken:
          '$2b$10$yE0B3tVzlPgJqC4VeCrF3e7CTrzLWxKAENjeP3QoKtO8HlCCX8kPO',
      });

      // Act
      const user = await authService.resetPassword(data);

      // Assert
      expect(user).toBeNull();
      expect(userService.find).toBeCalledTimes(1);
      expect(userService.update).not.toBeCalled();
    });

    it('5.3 - should return null if token was not set', async () => {
      // Arrange
      const data = {
        id: userMock.id,
        resetToken: '6eee50f13b99334c',
        password: 'newpassword123',
      };

      // Act
      const user = await authService.resetPassword(data);

      // Assert
      expect(user).toBeNull();
      expect(userService.find).toBeCalledTimes(1);
      expect(userService.update).not.toBeCalled();
    });
  });
});
