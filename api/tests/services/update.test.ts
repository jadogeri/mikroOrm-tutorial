import { ResourceNotFoundError } from "../../src/errors/resource-not-found.error";
import { UserService } from '../../src/services/user.service';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";


// user.service.update.spec.ts
// Mock definitions for complex dependencies

// Mock for User entity
class MockUser {
  public id: number = 1;
  public name: string = 'John Doe';
  public email: string = 'john@example.com';
}

// Mock for UserRepositoryInterface
interface MockUserRepositoryInterface {
  findOne: jest.Mock<any>;
  upsert: jest.Mock<any>;
}







// Begin test suite
describe('UserService.update() update method', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepositoryInterface;

  beforeEach(() => {
    // Initialize the mock repository with jest.fn()
    mockUserRepository = {
      findOne: jest.fn(),
      upsert: jest.fn(),
    };

    // Create the service and inject the mock repository
    userService = new UserService();
    (userService as any).userRepository = mockUserRepository as any;
  });

  // ------------------- Happy Paths -------------------
  describe('Happy paths', () => {
    it('should update user successfully when user exists and requestBody has name and email', async () => {
      // This test ensures that a user is updated when both name and email are provided.
      const userId = 1;
      const requestBody = { name: 'Jane Doe', email: 'jane@example.com' };
      const foundUser = new MockUser();
      foundUser.id = userId;
      foundUser.name = 'Old Name';
      foundUser.email = 'old@example.com';

      const updatedUser = new MockUser();
      updatedUser.id = userId;
      updatedUser.name = requestBody.name;
      updatedUser.email = requestBody.email;

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any) // First call: find existing user
        .mockResolvedValueOnce(updatedUser as any); // Second call: return updated user

      jest.mocked(mockUserRepository.upsert).mockResolvedValue(undefined as any);

      const result = await userService.update(userId, requestBody);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        name: requestBody.name,
        email: requestBody.email,
      }));
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedUser);
    });

    it('should update user when only name is provided in requestBody', async () => {
      // This test ensures that updating only the name field works as expected.
      const userId = 2;
      const requestBody = { name: 'New Name' };
      const foundUser = new MockUser();
      foundUser.id = userId;
      foundUser.name = 'Old Name';
      foundUser.email = 'old@example.com';

      const updatedUser = new MockUser();
      updatedUser.id = userId;
      updatedUser.name = requestBody.name;
      updatedUser.email = foundUser.email;

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any)
        .mockResolvedValueOnce(updatedUser as any);

      jest.mocked(mockUserRepository.upsert).mockResolvedValue(undefined as any);

      const result = await userService.update(userId, requestBody);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        name: requestBody.name,
        email: foundUser.email,
      }));
      expect(result).toEqual(updatedUser);
    });

    it('should update user when only email is provided in requestBody', async () => {
      // This test ensures that updating only the email field works as expected.
      const userId = 3;
      const requestBody = { email: 'newemail@example.com' };
      const foundUser = new MockUser();
      foundUser.id = userId;
      foundUser.name = 'Old Name';
      foundUser.email = 'old@example.com';

      const updatedUser = new MockUser();
      updatedUser.id = userId;
      updatedUser.name = foundUser.name;
      updatedUser.email = requestBody.email;

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any)
        .mockResolvedValueOnce(updatedUser as any);

      jest.mocked(mockUserRepository.upsert).mockResolvedValue(undefined as any);

      const result = await userService.update(userId, requestBody);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        name: foundUser.name,
        email: requestBody.email,
      }));
      expect(result).toEqual(updatedUser);
    });

    it('should update user when requestBody has extra fields (should assign them)', async () => {
      // This test ensures that extra fields in requestBody are assigned to the user.
      const userId = 4;
      const requestBody = { name: 'Extra Name', age: 30, isActive: true };
      const foundUser = new MockUser();
      foundUser.id = userId;
      foundUser.name = 'Old Name';
      foundUser.email = 'old@example.com';

      const updatedUser = {
        ...foundUser,
        ...requestBody,
      };

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any)
        .mockResolvedValueOnce(updatedUser as any);

      jest.mocked(mockUserRepository.upsert).mockResolvedValue(undefined as any);

      const result = await userService.update(userId, requestBody);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        name: requestBody.name,
        email: foundUser.email,
        age: 30,
        isActive: true,
      }));
      expect(result).toEqual(updatedUser);
    });
  });

  // ------------------- Edge Cases -------------------
  describe('Edge cases', () => {
    it('should throw ResourceNotFoundError if user does not exist', async () => {
      // This test ensures that an error is thrown if the user is not found.
      const userId = 999;
      const requestBody = { name: 'Ghost' };

      jest.mocked(mockUserRepository.findOne).mockResolvedValueOnce(undefined as any);

      await expect(userService.update(userId, requestBody))
        .rejects
        .toThrow(ResourceNotFoundError);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).not.toHaveBeenCalled();
    });

    it('should propagate error if upsert throws', async () => {
      // This test ensures that if upsert throws an error, it is propagated.
      const userId = 5;
      const requestBody = { name: 'Error Name' };
      const foundUser = new MockUser();
      foundUser.id = userId;

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any);

      const upsertError = new Error('Upsert failed');
      jest.mocked(mockUserRepository.upsert).mockRejectedValue(upsertError as never);

      await expect(userService.update(userId, requestBody))
        .rejects
        .toThrow('Upsert failed');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).toHaveBeenCalled();
    });

    it('should propagate error if second findOne throws', async () => {
      // This test ensures that if the second findOne (after upsert) throws, it is propagated.
      const userId = 6;
      const requestBody = { name: 'After Upsert' };
      const foundUser = new MockUser();
      foundUser.id = userId;

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any)
        .mockRejectedValueOnce(new Error('FindOne after upsert failed') as never);

      jest.mocked(mockUserRepository.upsert).mockResolvedValue(undefined as any);

      await expect(userService.update(userId, requestBody))
        .rejects
        .toThrow('FindOne after upsert failed');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).toHaveBeenCalled();
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should not mutate the original foundUser object reference', async () => {
      // This test ensures that Object.assign does not replace the object reference.
      const userId = 7;
      const requestBody = { name: 'Immutable' };
      const foundUser = new MockUser();
      foundUser.id = userId;
      foundUser.name = 'Old Name';

      const updatedUser = new MockUser();
      updatedUser.id = userId;
      updatedUser.name = requestBody.name;

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any)
        .mockResolvedValueOnce(updatedUser as any);

      jest.mocked(mockUserRepository.upsert).mockResolvedValue(undefined as any);

      await userService.update(userId, requestBody);

      expect(foundUser.name).toBe(requestBody.name);
    });

    it('should handle empty requestBody (no fields to update)', async () => {
      // This test ensures that an empty requestBody does not break the update logic.
      const userId = 8;
      const requestBody = {};
      const foundUser = new MockUser();
      foundUser.id = userId;
      foundUser.name = 'Old Name';
      foundUser.email = 'old@example.com';

      const updatedUser = new MockUser();
      updatedUser.id = userId;
      updatedUser.name = foundUser.name;
      updatedUser.email = foundUser.email;

      jest.mocked(mockUserRepository.findOne)
        .mockResolvedValueOnce(foundUser as any)
        .mockResolvedValueOnce(updatedUser as any);

      jest.mocked(mockUserRepository.upsert).mockResolvedValue(undefined as any);

      const result = await userService.update(userId, requestBody);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserRepository.upsert).toHaveBeenCalledWith(expect.objectContaining({
        id: userId,
        name: foundUser.name,
        email: foundUser.email,
      }));
      expect(result).toEqual(updatedUser);
    });
  });
});