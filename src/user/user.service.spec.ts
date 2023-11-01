import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let userService: UserService;
  let configService: ConfigService;
  let databaseService: DatabaseService;

  const returnedUserMock = {
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
        UserService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(returnedUserMock),
              findUniqueOrThrow: jest.fn().mockResolvedValue(returnedUserMock),
              update: jest.fn().mockResolvedValue(returnedUserMock),
              delete: jest.fn().mockResolvedValue(returnedUserMock),
            },
          },
        },
      ],
    }).compile();

    configService = testingModule.get<ConfigService>(ConfigService);
    userService = testingModule.get<UserService>(UserService);
    databaseService = testingModule.get<DatabaseService>(DatabaseService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(configService).toBeDefined();
      expect(userService).toBeDefined();
      expect(databaseService).toBeDefined();
    });
  });

  describe('1 - Create User', () => {
    it('1.1 - should be able to create a new user', async () => {
      // Arrange
      const userData = {
        firstName: 'Amanda',
        lastName: 'Jones',
        email: 'amanda.jones88@provider.com',
        document: '234.567.890-12',
        phone: '(11) 98765-4320',
        password: 'pass@123',
      };
      jest
        .spyOn(databaseService['user'], 'findUniqueOrThrow')
        .mockResolvedValueOnce(null);

      // Act
      const user = await userService.create(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(databaseService.user.create).toBeCalledTimes(1);
    });

    it('1.2 - should prevent creating a duplicated user', async () => {
      // Arrange
      const userData = {
        firstName: 'Amanda',
        lastName: 'Jones',
        email: 'amanda.jones88@provider.com',
        document: '234.567.890-12',
        phone: '(11) 98765-4320',
        password: 'pass@123',
      };

      // Act
      const user = await userService.create(userData);

      // Assert
      expect(user).toBeNull();
      expect(databaseService.user.create).not.toBeCalled();
    });
  });

  describe('2 - Find User', () => {
    it('2.1 - should successfuly find an user provided valid data', async () => {
      //Arrange
      const data = {
        email: 'amanda.jones88@provider.com',
      };

      // Act
      const user = await userService.find(data);

      // Assert
      expect(user).toBeDefined();
      expect(databaseService.user.findUniqueOrThrow).toBeCalledTimes(1);
    });

    it('2.2 - should return null if user not found', async () => {
      //Arrange
      const data = {
        email: 'amanda.jones88@provider.com',
      };
      jest
        .spyOn(databaseService['user'], 'findUniqueOrThrow')
        .mockResolvedValueOnce(null);

      // Act
      const user = await userService.find(data);

      // Assert
      expect(user).toBeNull();
      expect(databaseService.user.findUniqueOrThrow).toBeCalledTimes(1);
    });
  });

  describe('3 - Update User', () => {
    it('3.1 - should update an user provided valid information', async () => {
      // Arrange
      const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
      const update = {
        firstName: 'Joe',
        lastName: 'Jones',
        email: 'joe.jones@provider.com',
      };

      // Act
      const user = await userService.update(userId, update);

      // Assert
      expect(user).toBeDefined();
      expect(databaseService.user.update).toBeCalledTimes(1);
    });

    it('3.2 - should return null if user is not found', async () => {
      const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
      const update = {
        firstName: 'Joe',
        lastName: 'Jones',
        email: 'joe.jones@provider.com',
      };
      jest.spyOn(databaseService['user'], 'update').mockResolvedValue(null);

      // Act
      const user = await userService.update(userId, update);

      // Assert
      expect(user).toBeNull();
      expect(databaseService.user.update).toBeCalledTimes(1);
    });
  });

  describe('4 - Delete User', () => {
    it('4.1 - should successfuly remove an user', async () => {
      // Arrange
      const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';

      // Act
      const user = await userService.remove(userId);

      // Assert
      expect(user).toBeDefined();
      expect(databaseService.user.delete).toBeCalledTimes(1);
    });

    it('4.1 - should throw error if user not found', async () => {
      // Arrange
      const userId = '3aa8b139-2a52-443a-bae9-5c2127575f25';
      jest.spyOn(databaseService['user'], 'delete').mockResolvedValueOnce(null);

      // Act
      const user = await userService.remove(userId);

      // Assert
      expect(user).toBeNull();
      expect(databaseService.user.delete).toBeCalledTimes(1);
    });
  });
});
