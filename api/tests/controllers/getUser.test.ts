import 'reflect-metadata'; // Must be the first import
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Container } from 'inversify';
import { BadRequestError } from "../../src/errors/bad-request.error.js";
import { UserServiceInterface } from "../../src/interfaces/user-service.interface.js";
import { UserController } from '../../src/controllers/user.controller.js';
import { TYPES } from '../../src/types/di.type.js';

describe('UserController.getUser()', () => {
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
    it('should return user data when a valid userId is provided', async () => {
      const mockUserId = 1;
      const mockUserData = { id: mockUserId, name: 'John Doe', email: 'john@example.com' };
      
      mockUserService.getOne.mockResolvedValue(mockUserData as any);

      const result = await controller.getUser(mockUserId);

      expect(mockUserService.getOne).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUserData);
    });

    it('should propagate errors thrown by userService.getOne', async () => {
      const mockUserId = 2;
      mockUserService.getOne.mockRejectedValue(new Error('Database error'));

      await expect(controller.getUser(mockUserId)).rejects.toThrow('Database error');
    });
  });

  describe('Edge cases', () => {
    // Tests for falsy values (0, NaN, undefined)
    const invalidIds = [
      { id: 0, label: '0' },
      { id: NaN, label: 'NaN' },
      { id: undefined as any, label: 'undefined' }
    ];

    invalidIds.forEach(({ id, label }) => {
      it(`should throw BadRequestError if userId is ${label}`, async () => {
        await expect(controller.getUser(id)).rejects.toThrow(BadRequestError);
        await expect(controller.getUser(id)).rejects.toThrow('User ID is required');
        expect(mockUserService.getOne).not.toHaveBeenCalled();
      });
    });

    it('should call userService.getOne for negative numbers (truthy in JS)', async () => {
      const mockUserId = -5;
      mockUserService.getOne.mockResolvedValue({ id: -5, name: 'Negative User' } as any);

      await controller.getUser(mockUserId);
      expect(mockUserService.getOne).toHaveBeenCalledWith(mockUserId);
    });

    it('should handle MAX_SAFE_INTEGER', async () => {
      const mockUserId = Number.MAX_SAFE_INTEGER;
      mockUserService.getOne.mockResolvedValue({ id: mockUserId } as any);

      await controller.getUser(mockUserId);
      expect(mockUserService.getOne).toHaveBeenCalledWith(mockUserId);
    });
  });
});
