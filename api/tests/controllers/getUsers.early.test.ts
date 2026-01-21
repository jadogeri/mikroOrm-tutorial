import { UserServiceInterface } from "../../src/interfaces/user-service.interface";
import { UserController } from '../../src/controllers/user.controller';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Container } from "inversify";
import { TYPES } from "../../src/types/di.type";


describe('UserController.getUsers() getUsers method', () => {
  // Happy paths  let container: Container;
  let container: Container;
  let mockUserService: jest.Mocked<UserServiceInterface>;
  let controller: UserController;

  beforeEach(() => {
    container = new Container();

    // 1. Create a clean mock with typed methods
    mockUserService = {
      create: jest.fn(),
      getOne: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    // 2. Bind dependencies to the test container
    container.bind<UserServiceInterface>(TYPES.UserServiceInterface).toConstantValue(mockUserService);
    container.bind<UserController>(UserController).toSelf();

    // 3. Resolve the controller (Dependencies are now properly injected)
    controller = container.get<UserController>(UserController);
  });
  describe('Happy paths', () => {
    it('should return a list of users when userService.getAll resolves with multiple users', async () => {
      // This test ensures getUsers returns the expected list when userService.getAll returns multiple users.
      const mockUsers = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ];
      mockUserService.getAll.mockResolvedValue(mockUsers);
       

      (controller as any).userService = mockUserService;

      const result = await controller.getUsers();
      expect(result).toEqual(mockUsers);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when userService.getAll resolves with an empty array', async () => {
      // This test ensures getUsers returns an empty array when there are no users.
      mockUserService.getAll.mockResolvedValue([]);

      (controller as any).userService = mockUserService;

      const result = await controller.getUsers();
      expect(result).toEqual([]);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return a single user in an array when userService.getAll resolves with one user', async () => {
      // This test ensures getUsers returns a single user in an array when only one user exists.
      const mockUsers = [
        { id: 1, name: 'Charlie', email: 'charlie@example.com' },
      ];
      mockUserService.getAll.mockResolvedValue(mockUsers);
      (controller as any).userService = mockUserService;

      const result = await controller.getUsers();
      expect(result).toEqual(mockUsers);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return a single user in an array when userService.getAll resolves with one user', async () => {
      // This test ensures getUsers returns a single user in an array when only one user exists.
      const mockUsers = [
        { id: 1, name: 'Charlie', email: 'charlie@example.com' },
      ];
      mockUserService.getAll.mockResolvedValue(mockUsers);
      (controller as any).userService = mockUserService;
      const result = await controller.getUsers();
      console.log(result);
      console.log(mockUsers);
      expect(result[0]).toEqual(mockUsers[0]);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('should propagate errors thrown by userService.getAll', async () => {
      // This test ensures getUsers throws if userService.getAll throws an error.
      const error = new Error('Database failure');
      mockUserService.getAll.mockRejectedValue(error);

      (controller as any).userService = mockUserService;

      await expect(controller.getUsers()).rejects.toThrow('Database failure');
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return whatever userService.getAll returns, even if it is not an array', async () => {
      // This test ensures getUsers returns non-array values if userService.getAll returns them.
      // (e.g., if the service is misconfigured or returns a different type)
      const mockReturnValue = { unexpected: 'object' };
      mockUserService.getAll.mockResolvedValue(mockReturnValue);


      (controller as any).userService = mockUserService;

      const result = await controller.getUsers();
      expect(result).toBe(mockReturnValue);
      expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    });
  });
});