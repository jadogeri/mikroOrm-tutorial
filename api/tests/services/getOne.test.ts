import { ResourceNotFoundError } from "../../src/errors/resource-not-found.error";
import { UserService } from '../../src/services/user.service';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Manual mocks for dependencies

// Mock for User entity
class MockUser {
  public id: number = 1;
  public name: string = 'John Doe';
  public email: string = 'john@example.com';
}

// Mock for UserRepositoryInterface
interface MockUserRepositoryInterface {
  findOne: jest.Mock<any> ;
}





// Begin test suite
describe('UserService.getOne() getOne method', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepositoryInterface;

  beforeEach(() => {
    // Initialize the mock repository with jest.fn()
    mockUserRepository = {
      findOne: jest.fn(),
    };

    // Create the service and inject the mock repository
    userService = new UserService();
    // Assign the mock repository to the private property
    (userService as any).userRepository = mockUserRepository as any;
  });

  // =========================
  // Happy Path Tests
  // =========================

  it('should return the user when found (basic case)', async () => {
    // This test ensures getOne returns the user when found by ID.
    const mockUser = new MockUser();
    jest.mocked(mockUserRepository.findOne).mockResolvedValue(mockUser as any);

    const result = await userService.getOne(1);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    expect(result).toBe(mockUser);
  });

  it('should return the user when found with a different ID', async () => {
    // This test ensures getOne works for a different user ID.
    const mockUser = new MockUser();
    mockUser.id = 42;
    jest.mocked(mockUserRepository.findOne).mockResolvedValue(mockUser as any);

    const result = await userService.getOne(42);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 42 });
    expect(result).toBe(mockUser);
  });

  it('should return a user with all expected properties', async () => {
    // This test ensures the returned user contains all expected properties.
    const mockUser = new MockUser();
    mockUser.id = 7;
    mockUser.name = 'Alice';
    mockUser.email = 'alice@example.com';
    jest.mocked(mockUserRepository.findOne).mockResolvedValue(mockUser as any);

    const result = await userService.getOne(7);

    expect(result).toHaveProperty('id', 7);
    expect(result).toHaveProperty('name', 'Alice');
    expect(result).toHaveProperty('email', 'alice@example.com');
  });

  // =========================
  // Edge Case Tests
  // =========================

  it('should throw ResourceNotFoundError if user is not found', async () => {
    // This test ensures getOne throws ResourceNotFoundError when no user is found.
    jest.mocked(mockUserRepository.findOne).mockResolvedValue(undefined as any);

    await expect(userService.getOne(999)).rejects.toBeInstanceOf(ResourceNotFoundError);
    await expect(userService.getOne(999)).rejects.toThrow('User with ID 999 not found');
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 999 });
  });

  it('should handle userId as 0 (edge case)', async () => {
    // This test ensures getOne works when userId is 0.
    const mockUser = new MockUser();
    mockUser.id = 0;
    jest.mocked(mockUserRepository.findOne).mockResolvedValue(mockUser as any);

    const result = await userService.getOne(0);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 0 });
    expect(result).toBe(mockUser);
  });

  it('should handle large userId values', async () => {
    // This test ensures getOne works for very large userId values.
    const largeId = Number.MAX_SAFE_INTEGER;
    const mockUser = new MockUser();
    mockUser.id = largeId;
    jest.mocked(mockUserRepository.findOne).mockResolvedValue(mockUser as any);

    const result = await userService.getOne(largeId);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: largeId });
    expect(result).toBe(mockUser);
  });

  it('should propagate errors thrown by userRepository.findOne', async () => {
    // This test ensures getOne propagates errors from the repository.
    const error = new Error('Database failure');
    jest.mocked(mockUserRepository.findOne).mockRejectedValue(error as any);

    await expect(userService.getOne(5)).rejects.toThrow('Database failure');
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 5 });
  });

  it('should not catch ResourceNotFoundError thrown by repository', async () => {
    // This test ensures getOne does not catch ResourceNotFoundError thrown by repository.
    const error = new ResourceNotFoundError('Repository error');
    jest.mocked(mockUserRepository.findOne).mockRejectedValue(error as any);

    await expect(userService.getOne(123)).rejects.toBe(error);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 123 });
  });
});