import { User } from "../../src/entities/user.entity";
import { ConflictError } from "../../src/errors/conflict.error";
import { UserService } from '../../src/services/user.service';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Mock for SqlEntityManager
class MockSqlEntityManager {
  public create = jest.fn();
}

// Mock for UserRepositoryInterface
class MockUserRepositoryInterface {
  public findByName = jest.fn();
  public findByEmail = jest.fn();
  public getEntityManager = jest.fn();
}

// Mock for User entity
class MockUser {
  public id: number = 1;
  public name: string = 'Test User';
  public email: string = 'test@example.com';
}

describe('UserService.create() create method', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepositoryInterface;
  let mockEntityManager: MockSqlEntityManager;

  beforeEach(() => {
    // Initialize mocks before each test
    mockUserRepository = new MockUserRepositoryInterface();
    mockEntityManager = new MockSqlEntityManager();

    // Assign the entity manager mock to the repository mock
    jest.mocked(mockUserRepository.getEntityManager).mockReturnValue(mockEntityManager as any);

    // Create the service and inject the mock repository
    userService = new UserService();
    (userService as any).userRepository = mockUserRepository as any;
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should create a new user when name and email are unique', async () => {
      // Test: Should create user when both name and email are unique
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(null as any as never);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(null as any as never);

      const requestBody = { name: 'Alice', email: 'alice@example.com' };
      const createdUser = new MockUser();
      jest.mocked(mockEntityManager.create).mockReturnValue(createdUser as any);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByName).toHaveBeenCalledWith('Alice');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('alice@example.com');
      expect(mockEntityManager.create).toHaveBeenCalledWith(User, requestBody);
      expect(result).toBe(createdUser);
    });

    it('should create a user with different valid names and emails', async () => {
      // Test: Should create user for different valid name/email combinations
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(null as any as never);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(null as any as never  );

      const requestBody = { name: 'Bob', email: 'bob@domain.com' };
      const createdUser = { id: 2, name: 'Bob', email: 'bob@domain.com' } as any;
      jest.mocked(mockEntityManager.create).mockReturnValue(createdUser);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByName).toHaveBeenCalledWith('Bob');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('bob@domain.com');
      expect(mockEntityManager.create).toHaveBeenCalledWith(User, requestBody);
      expect(result).toBe(createdUser);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw ConflictError if user with same name exists', async () => {
      // Test: Should throw ConflictError when name already exists
      const existingUser = new MockUser();
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(existingUser as any as never);

      const requestBody = { name: 'Alice', email: 'alice2@example.com' };

      await expect(userService.create(requestBody)).rejects.toThrow(ConflictError);
      await expect(userService.create(requestBody)).rejects.toThrow('User with this name Alice already exists');
      expect(mockUserRepository.findByName).toHaveBeenCalledWith('Alice');
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockEntityManager.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictError if user with same email exists', async () => {
      // Test: Should throw ConflictError when email already exists
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(null as any as never);
      const existingUser = new MockUser();
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser as any as never);

      const requestBody = { name: 'Charlie', email: 'test@example.com' };

      await expect(userService.create(requestBody)).rejects.toThrow(ConflictError);
      await expect(userService.create(requestBody)).rejects.toThrow('User with this email test@example.com already exists');
      expect(mockUserRepository.findByName).toHaveBeenCalledWith('Charlie');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockEntityManager.create).not.toHaveBeenCalled();
    });

    it('should handle names and emails with special characters', async () => {
      // Test: Should create user with special characters in name/email
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(null as any as never);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(null as any as never);

      const requestBody = { name: 'Jöhn Dœ', email: 'john.doe+test@exämple.com' };
      const createdUser = { id: 3, name: 'Jöhn Dœ', email: 'john.doe+test@exämple.com' } as any;
      jest.mocked(mockEntityManager.create).mockReturnValue(createdUser);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByName).toHaveBeenCalledWith('Jöhn Dœ');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john.doe+test@exämple.com');
      expect(mockEntityManager.create).toHaveBeenCalledWith(User, requestBody);
      expect(result).toBe(createdUser);
    });

    it('should handle very long names and emails', async () => {
      // Test: Should create user with long name/email
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(null as any as never);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(null as any as never);

      const longName = 'A'.repeat(256);
      const longEmail = 'user' + 'B'.repeat(240) + '@example.com';
      const requestBody = { name: longName, email: longEmail };
      const createdUser = { id: 4, name: longName, email: longEmail } as any;
      jest.mocked(mockEntityManager.create).mockReturnValue(createdUser);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByName).toHaveBeenCalledWith(longName);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(longEmail);
      expect(mockEntityManager.create).toHaveBeenCalledWith(User, requestBody);
      expect(result).toBe(createdUser);
    });

    it('should propagate errors thrown by repository methods', async () => {
      // Test: Should propagate errors from repository
      const error = new Error('Database error');
      jest.mocked(mockUserRepository.findByName).mockRejectedValue(error as never);

      const requestBody = { name: 'ErrorUser', email: 'error@example.com' };

      await expect(userService.create(requestBody)).rejects.toThrow('Database error');
      expect(mockUserRepository.findByName).toHaveBeenCalledWith('ErrorUser');
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockEntityManager.create).not.toHaveBeenCalled();
    });

    it('should propagate errors thrown by entity manager create', async () => {
      // Test: Should propagate errors from entity manager create
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(null as any as never);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(null as any as never);

      const error = new Error('EntityManager error');
      jest.mocked(mockEntityManager.create).mockImplementation(() => { throw error; });

      const requestBody = { name: 'EntityError', email: 'entityerror@example.com' };

      await expect(userService.create(requestBody)).rejects.toThrow('EntityManager error');
      expect(mockUserRepository.findByName).toHaveBeenCalledWith('EntityError');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('entityerror@example.com');
      expect(mockEntityManager.create).toHaveBeenCalledWith(User, requestBody);
    });

    it('should not call entity manager if name or email already exists', async () => {
      // Test: Should not call entity manager if name exists
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(new MockUser() as any as never);

      const requestBody = { name: 'Duplicate', email: 'duplicate@example.com' };

      await expect(userService.create(requestBody)).rejects.toThrow(ConflictError);
      expect(mockEntityManager.create).not.toHaveBeenCalled();

      // Test: Should not call entity manager if email exists
      jest.mocked(mockUserRepository.findByName).mockResolvedValue(null as any as never);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValue(new MockUser() as any as never);
      await expect(userService.create(requestBody)).rejects.toThrow(ConflictError);
      expect(mockEntityManager.create).not.toHaveBeenCalled();
    });
  });
});