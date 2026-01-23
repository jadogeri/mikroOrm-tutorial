import { ResourceNotFoundError } from "../../src/errors/resource-not-found.error";
import { UserService } from '../../src/services/user.service';
import { jest, describe, it, expect, beforeEach } from "@jest/globals";


// Manual mocks for complex dependencies

// Mock for User entity
class MockUser {
  public id: number = 1;
  public name: string = 'Test User';
  public email: string = 'test@example.com';
}

// Mock for SqlEntityManager
class MockSqlEntityManager {
  public remove = jest.mocked(jest.fn().mockReturnThis());
  public flush = jest.mocked(jest.fn().mockResolvedValue(undefined as never));
}

// Mock for UserRepositoryInterface
interface MockUserRepositoryInterface {
  findOne: jest.Mock;
  getEntityManager: jest.Mock;
}




// Begin test suite
describe('UserService.delete() delete method', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepositoryInterface;
  let mockEntityManager: MockSqlEntityManager;

  beforeEach(() => {
    // Initialize mocks before each test
    mockEntityManager = new MockSqlEntityManager();
    mockUserRepository = {
      findOne: jest.mocked(jest.fn()),
      getEntityManager: jest.mocked(jest.fn().mockReturnValue(mockEntityManager as any)),
    };
    userService = new UserService();
    // Inject the mock repository into the service
    (userService as any).userRepository = mockUserRepository as any;
  });

  //
  // Happy Path Tests
  //

  it('should delete an existing user and return a success message', async () => {
    // This test ensures that a user is deleted successfully when found.
    const userId = 42;
    const mockUser = new MockUser();
    mockUser.id = userId;

    mockUserRepository.findOne.mockResolvedValueOnce(mockUser as never);

    // Act
    const result = await userService.delete(userId);

    // Assert
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
    expect(mockUserRepository.getEntityManager).toHaveBeenCalled();
    expect(mockEntityManager.remove).toHaveBeenCalledWith(mockUser as any);
    expect(mockEntityManager.flush).toHaveBeenCalled();
    expect(result).toEqual({ message: `User with ID ${userId} has been deleted` });
  });

  it('should call remove and flush exactly once each for a found user', async () => {
    // This test ensures remove and flush are called exactly once.
    const userId = 7;
    const mockUser = new MockUser();
    mockUser.id = userId;

    mockUserRepository.findOne.mockResolvedValueOnce(mockUser as never);

    await userService.delete(userId);

    expect(mockEntityManager.remove).toHaveBeenCalledTimes(1);
    expect(mockEntityManager.flush).toHaveBeenCalledTimes(1);
  });

  //
  // Edge Case Tests
  //

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    // This test ensures that the method throws if the user is not found.
    const userId = 99;
    mockUserRepository.findOne.mockResolvedValueOnce(undefined as never);

    await expect(userService.delete(userId)).rejects.toThrow(ResourceNotFoundError);
    await expect(userService.delete(userId)).rejects.toThrow(`User with ID ${userId} not found`);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: userId });
    expect(mockEntityManager.remove).not.toHaveBeenCalled();
    expect(mockEntityManager.flush).not.toHaveBeenCalled();
  });

  it('should propagate errors thrown by entityManager.remove', async () => {
    // This test ensures that if remove throws, the error is propagated.
    const userId = 55;
    const mockUser = new MockUser();
    mockUser.id = userId;

    mockUserRepository.findOne.mockResolvedValueOnce(mockUser as never);
    mockEntityManager.remove.mockImplementationOnce(() => {
      throw new Error('Remove failed');
    });

    await expect(userService.delete(userId)).rejects.toThrow('Remove failed');
    expect(mockEntityManager.remove).toHaveBeenCalledWith(mockUser as any);
    expect(mockEntityManager.flush).not.toHaveBeenCalled();
  });

  it('should propagate errors thrown by entityManager.flush', async () => {
    // This test ensures that if flush throws, the error is propagated.
    const userId = 66;
    const mockUser = new MockUser();
    mockUser.id = userId;

    mockUserRepository.findOne.mockResolvedValueOnce(mockUser as never);
    mockEntityManager.flush.mockRejectedValueOnce(new Error('Flush failed') as never);

    await expect(userService.delete(userId)).rejects.toThrow('Flush failed');
    expect(mockEntityManager.remove).toHaveBeenCalledWith(mockUser as any);
    expect(mockEntityManager.flush).toHaveBeenCalled();
  });

  it('should work with minimum valid userId (e.g., 1)', async () => {
    // This test ensures that the method works with the lowest valid userId.
    const userId = 1;
    const mockUser = new MockUser();
    mockUser.id = userId;

    mockUserRepository.findOne.mockResolvedValueOnce(mockUser as never);

    const result = await userService.delete(userId);

    expect(result).toEqual({ message: `User with ID ${userId} has been deleted` });
  });

  it('should work with a very large userId', async () => {
    // This test ensures that the method works with a very large userId.
    const userId = Number.MAX_SAFE_INTEGER;
    const mockUser = new MockUser();
    mockUser.id = userId;

    mockUserRepository.findOne.mockResolvedValueOnce(mockUser as never);

    const result = await userService.delete(userId);

    expect(result).toEqual({ message: `User with ID ${userId} has been deleted` });
  });
});