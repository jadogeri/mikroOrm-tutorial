import 'reflect-metadata'; // Must be the first import
import { BadRequestError } from "../../src/errors/bad-request.error";
import { UserServiceInterface } from "../../src/interfaces/user-service.interface";
import { UserController } from '../../src/controllers/user.controller';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { TYPES } from '../../src/types/di.type';
import { Container } from 'inversify';

describe('UserController.deleteUser() deleteUser method', () => {
  // Happy Paths
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
    it('should delete a user when a valid userId is provided', async () => {
      // This test ensures that deleteUser calls userService.delete with the correct userId and returns its result.
      mockUserService.delete.mockResolvedValue({ success: true, deletedUserId: 123 });

      const userId = 123;
      const result = await controller.deleteUser(userId);

      expect(mockUserService.delete).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ success: true, deletedUserId: 123 });
    });

    it('should propagate the result from userService.delete', async () => {
      // This test ensures that whatever userService.delete returns is returned by deleteUser.
      const mockDeleteResult = { status: 'ok', removed: true };
      mockUserService.delete.mockResolvedValue(mockDeleteResult);
      (controller as any).userService = mockUserService;

      const userId = 42;
      const result = await controller.deleteUser(userId);

      expect(result).toBe(mockDeleteResult);
    });
  });

  // Edge Cases
  describe('Edge cases', () => {
    it('should throw BadRequestError if userId is 0', async () => {
      // This test ensures that deleteUser throws BadRequestError when userId is 0 (falsy).
      (controller as any).userService = {
        delete: jest.fn(),
      };

      let thrownError: any;
      try {
        await controller.deleteUser(0);
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBeInstanceOf(BadRequestError);
      expect(thrownError.message).toBe('User ID is required');
    });

    it('should throw BadRequestError if userId is NaN', async () => {
      // This test ensures that deleteUser throws BadRequestError when userId is NaN (falsy).
      (controller as any).userService = {
        delete: jest.fn(),
      };

      let thrownError: any;
      try {
        await controller.deleteUser(Number.NaN);
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBeInstanceOf(BadRequestError);
      expect(thrownError.message).toBe('User ID is required');
    });

    it('should throw BadRequestError if userId is undefined', async () => {
      // This test ensures that deleteUser throws BadRequestError when userId is undefined.
      (controller as any).userService = {
        delete: jest.fn(),
      };

      let thrownError: any;
      try {
        // @ts-ignore
        await controller.deleteUser(undefined);
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBeInstanceOf(BadRequestError);
      expect(thrownError.message).toBe('User ID is required');
    });

    it('should throw BadRequestError if userId is null', async () => {
      // This test ensures that deleteUser throws BadRequestError when userId is null.
      (controller as any).userService = {
        delete: jest.fn(),
      };

      let thrownError: any;
      try {
        // @ts-ignore
        await controller.deleteUser(null);
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBeInstanceOf(BadRequestError);
      expect(thrownError.message).toBe('User ID is required');
    });

    it('should propagate errors thrown by userService.delete', async () => {
      // This test ensures that if userService.delete throws, the error is propagated.
      const mockError = new Error('Database error');
      const mockUserService = {
        delete: jest.fn().mockRejectedValue(mockError as never),
      };

      (controller as any).userService = mockUserService;

      let thrownError: any;
      try {
        await controller.deleteUser(5);
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBe(mockError);
    });
  });
});