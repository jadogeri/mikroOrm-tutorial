import { User } from "../../src/entities/user.entity";
import { UserService } from '../../src/services/user.service';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Manual mock for UserRepositoryInterface
interface MockUserRepositoryInterface {
  findAll: jest.Mock<any>;
}



// Helper to create mock users
function createMockUser(id: number, name: string, email: string): User {
  const user = new User() as any;
  user.id = id;
  user.name = name;
  user.email = email;
  return user as any;
}

describe('UserService.getAll() getAll method', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepositoryInterface;

  beforeEach(() => {
    // Initialize the mock repository with jest.fn()
    mockUserRepository = {
      findAll: jest.fn() as any,
    };

    // Create the service and inject the mock repository
    userService = new UserService();
    (userService as any).userRepository = mockUserRepository as any;
  });

  // =========================
  // Happy Path Tests
  // =========================

  it('should return an array of users when repository returns multiple users', async () => {
    // This test ensures getAll returns all users as expected
    const mockUsers = [
      createMockUser(1, 'Alice', 'alice@example.com'),
      createMockUser(2, 'Bob', 'bob@example.com'),
    ];
    jest.mocked(mockUserRepository.findAll).mockResolvedValue(mockUsers as any);

    const result = await userService.getAll();

    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Alice');
    expect(result[1].email).toBe('bob@example.com');
  });

  it('should return an empty array when repository returns no users', async () => {
    // This test ensures getAll handles empty user lists correctly
    jest.mocked(mockUserRepository.findAll).mockResolvedValue([] as any);

    const result = await userService.getAll();

    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should return users with all expected properties', async () => {
    // This test ensures returned users have all expected properties
    const mockUsers = [
      createMockUser(3, 'Charlie', 'charlie@example.com'),
    ];
    jest.mocked(mockUserRepository.findAll).mockResolvedValue(mockUsers as any);

    const result = await userService.getAll();

    expect(result[0]).toHaveProperty('id', 3);
    expect(result[0]).toHaveProperty('name', 'Charlie');
    expect(result[0]).toHaveProperty('email', 'charlie@example.com');
  });

  // =========================
  // Edge Case Tests
  // =========================

  it('should propagate errors thrown by userRepository.findAll', async () => {
    // This test ensures getAll propagates repository errors
    const error = new Error('Database failure');
    jest.mocked(mockUserRepository.findAll).mockRejectedValue(error as never);

    await expect(userService.getAll()).rejects.toThrow('Database failure');
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository returning unexpected data types (e.g., string)', async () => {
    // This test ensures getAll can handle unexpected repository return types
    jest.mocked(mockUserRepository.findAll).mockResolvedValue('unexpected string' as any);

    const result = await userService.getAll();

    expect(result).toBe('unexpected string');
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository returning a single user object instead of array', async () => {
    // This test ensures getAll can handle a single user object returned
    const singleUser = createMockUser(4, 'Dana', 'dana@example.com');
    jest.mocked(mockUserRepository.findAll).mockResolvedValue(singleUser as any);

    const result = await userService.getAll();

    expect(result).toEqual(singleUser);
    expect(result.id).toBe(4);
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle repository returning array with mixed types', async () => {
    // This test ensures getAll can handle arrays with mixed types
    const mixedArray = [
      createMockUser(5, 'Eve', 'eve@example.com'),
      { id: 6, name: 'Frank', email: 'frank@example.com', extra: 'field' },
      42,
      'string',
    ];
    jest.mocked(mockUserRepository.findAll).mockResolvedValue(mixedArray as any);

    const result = await userService.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Eve');
    expect(result[1].extra).toBe('field');
    expect(result[2]).toBe(42);
    expect(result[3]).toBe('string');
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });
});