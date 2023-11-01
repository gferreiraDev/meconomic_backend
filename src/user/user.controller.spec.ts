import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const userMock = {
    id: 'e7891224-f574-4ab1-851d-ab96873adb1e',
    firstName: 'Anne',
    lastName: 'Jonnah',
    email: 'jonnah.anne@provider.com',
    document: '789.456.852-30',
    phone: '(11) 97485-9633',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$YyfBR0ciLZc3DsvZr/XIDg$77ZgNufwVRvzzqXg1yw/ufg78qFnee+UlujNOHfyrss',
    resetToken: null,
    isValidated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(userMock),
            find: jest.fn().mockResolvedValue(userMock),
            update: jest.fn().mockResolvedValue(userMock),
            remove: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();

    userController = testingModule.get<UserController>(UserController);
    userService = testingModule.get<UserService>(UserService);
  });

  describe('0 - Initialization', () => {
    it('0.1 - should be defined', () => {
      expect(userController).toBeDefined();
      expect(userService).toBeDefined();
    });
  });

  describe('1 - Update User', () => {
    it('1.1 - should successfuly update an user', async () => {
      // Arrange
      const userId = 'e7891224-f574-4ab1-851d-ab96873adb1e';
      const update = {
        firstName: 'User',
        lastName: 'Updated',
      };
      jest
        .spyOn(userService, 'update')
        .mockResolvedValueOnce(Object.assign(userMock, update));

      // Act
      const user = await userController.updateUser(userId, update);

      // Assert
      expect(user).toBeDefined();
      expect(userService.update).toBeCalledTimes(1);
    });

    it('1.2 - should throw error provided an invalid data', async () => {
      // Arrange
      const userId = 'e7891224-f574-4ab1-851d-ab96873adb1e';
      const update = {
        firstName: 'User',
        lastName: 'Updated',
      };
      jest.spyOn(userService, 'update').mockResolvedValueOnce(null);

      // Act
      const user = userController.updateUser(userId, update);

      // Assert
      expect(user).rejects.toThrow();
      expect(userService.update).toBeCalledTimes(1);
    });
  });

  describe('2 - Delete User', () => {
    it('2.1 - should be able to delete a user provided a valid id', async () => {
      // Arrange
      const userId = 'e7891224-f574-4ab1-851d-ab96873adb1e';

      // Act
      const user = await userController.deleteUser(userId);

      // Assert
      expect(user).toBeDefined();
      expect(userService.remove).toBeCalledTimes(1);
    });

    it('2.2 - should throw error if user not found', async () => {
      // Arrange
      const userId = 'e7891224-f574-4ab1-851d-ab96873adb1e';
      jest.spyOn(userService, 'remove').mockResolvedValueOnce(null);

      // Act
      const user = userController.deleteUser(userId);

      // Assert
      expect(user).rejects.toThrow();
      expect(userService.remove).toBeCalledTimes(1);
    });
  });
});
