import { BadRequestError } from "../../src/errors/bad-request.error";
import { UserServiceInterface } from "../../src/interfaces/user-service.interface";
import { UserController } from '../../src/controllers/user.controller';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe('UserController.updateUser() updateUser method', () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<UserServiceInterface>;

  beforeEach(() => {
    // Create a fresh controller and mock service before each test
    controller = new UserController();
    mockUserService = {
      create: jest.fn(),
      getOne: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    // Assign the mock service to the controller's private property
    (controller as any).userService = mockUserService as any;
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should update user when both name and email are provided', async () => {
      // This test ensures updateUser works when both name and email are present
      const userId = 1;
      const requestBody = { name: 'John Doe', email: 'john@example.com' };
      const expectedResponse = { id: userId, ...requestBody };

      mockUserService.update.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(userId, requestBody);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, requestBody);
      expect(result).toEqual(expectedResponse);
    });

    it('should update user when only name is provided', async () => {
      // This test ensures updateUser works when only name is present
      const userId = 2;
      const requestBody = { name: 'Jane Doe' };
      const expectedResponse = { id: userId, name: 'Jane Doe' };

      mockUserService.update.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(userId, requestBody);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, requestBody);
      expect(result).toEqual(expectedResponse);
    });

    it('should update user when only email is provided', async () => {
      // This test ensures updateUser works when only email is present
      const userId = 3;
      const requestBody = { email: 'jane@example.com' };
      const expectedResponse = { id: userId, email: 'jane@example.com' };

      mockUserService.update.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(userId, requestBody);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, requestBody);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw BadRequestError if neither name nor email is provided', async () => {
      // This test ensures updateUser throws error when both fields are missing
      const userId = 4;
      const requestBody = {};

      await expect(controller.updateUser(userId, requestBody)).rejects.toThrow(BadRequestError);
      await expect(controller.updateUser(userId, requestBody)).rejects.toThrow('At least one of name or email is required');
      expect(mockUserService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if userId is 0', async () => {
      // This test ensures updateUser throws error when userId is 0 (falsy)
      const userId = 0;
      const requestBody = { name: 'Zero User' };

      await expect(controller.updateUser(userId, requestBody)).rejects.toThrow(BadRequestError);
      await expect(controller.updateUser(userId, requestBody)).rejects.toThrow('User ID is required');
      expect(mockUserService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if userId is missing', async () => {
      // This test ensures updateUser throws error when userId is undefined
      // @ts-ignore: Simulate missing argument
      await expect(controller.updateUser(undefined, { name: 'Missing ID' })).rejects.toThrow(BadRequestError);
      await expect(controller.updateUser(undefined, { name: 'Missing ID' })).rejects.toThrow('User ID is required');
      expect(mockUserService.update).not.toHaveBeenCalled();
    });

    it('should handle userService.update throwing an error', async () => {
      // This test ensures updateUser propagates errors from userService.update
      const userId = 5;
      const requestBody = { name: 'Error User' };
      const serviceError = new Error('Service failure');

      mockUserService.update.mockRejectedValue(serviceError);

      await expect(controller.updateUser(userId, requestBody)).rejects.toThrow(serviceError);
      expect(mockUserService.update).toHaveBeenCalledWith(userId, requestBody);
    });

    it('should allow name to be an empty string if email is provided', async () => {
      // This test ensures updateUser allows empty string for name if email is present
      const userId = 6;
      const requestBody = { name: '', email: 'emptyname@example.com' };
      const expectedResponse = { id: userId, name: '', email: 'emptyname@example.com' };

      mockUserService.update.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(userId, requestBody);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, requestBody);
      expect(result).toEqual(expectedResponse);
    });

    it('should allow email to be an empty string if name is provided', async () => {
      // This test ensures updateUser allows empty string for email if name is present
      const userId = 7;
      const requestBody = { name: 'Empty Email', email: '' };
      const expectedResponse = { id: userId, name: 'Empty Email', email: '' };

      mockUserService.update.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(userId, requestBody);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, requestBody);
      expect(result).toEqual(expectedResponse);
    });
  });
});