import { SqlEntityManager } from "@mikro-orm/sqlite";
import { UserRepository } from '../user.repository';






// Mock for User entity
class MockUser {
  public id: number = 1;
  public name: string = 'TestUser';
  public email: string = 'testuser@example.com';
}

// Jest mock for SqlEntityManager
const mockSqlEntityManager = {
  // Add any methods if needed for future tests
} as unknown as jest.Mocked<SqlEntityManager>;

// Jest mock for EntityRepository

// Helper to create UserRepository with mocked EntityRepository
function createUserRepositoryWithFindOneMock(findOneMock: jest.Mock): UserRepository {
  // We need to override the findOne method of EntityRepository
  const repo = new UserRepository(mockSqlEntityManager as any);
  // @ts-ignore: Overriding for test
  repo.findOne = findOneMock;
  return repo;
}

describe('UserRepository.findByName() findByName method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a user when a user with the given name exists', async () => {
      // This test verifies that findByName returns the correct user when found.
      const expectedUser = new MockUser();
      const findOneMock = jest.fn().mockResolvedValue(expectedUser as any as never);
      const userRepository = createUserRepositoryWithFindOneMock(jest.mocked(findOneMock));

      const result = await userRepository.findByName('TestUser');

      expect(findOneMock).toHaveBeenCalledWith({ name: 'TestUser' });
      expect(result).toBe(expectedUser);
    });

    it('should return null when no user with the given name exists', async () => {
      // This test verifies that findByName returns null when no user is found.
      const findOneMock = jest.fn().mockResolvedValue(null);
      const userRepository = createUserRepositoryWithFindOneMock(jest.mocked(findOneMock));

      const result = await userRepository.findByName('NonExistentUser');

      expect(findOneMock).toHaveBeenCalledWith({ name: 'NonExistentUser' });
      expect(result).toBeNull();
    });

    it('should call findOne with the correct filter query', async () => {
      // This test ensures that findByName passes the correct filter to findOne.
      const findOneMock = jest.fn().mockResolvedValue(new MockUser() as any as never);
      const userRepository = createUserRepositoryWithFindOneMock(jest.mocked(findOneMock));

      await userRepository.findByName('AnotherUser');

      expect(findOneMock).toHaveBeenCalledWith({ name: 'AnotherUser' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle empty string as name and call findOne with empty name', async () => {
      // This test checks behavior when an empty string is provided as the name.
      const findOneMock = jest.fn().mockResolvedValue(null);
      const userRepository = createUserRepositoryWithFindOneMock(jest.mocked(findOneMock));

      const result = await userRepository.findByName('');

      expect(findOneMock).toHaveBeenCalledWith({ name: '' });
      expect(result).toBeNull();
    });

    it('should handle special characters in name', async () => {
      // This test checks that special characters in the name are handled correctly.
      const specialName = '!@#$%^&*()_+';
      const expectedUser = new MockUser();
      expectedUser.name = specialName;
      const findOneMock = jest.fn().mockResolvedValue(expectedUser as any as never);
      const userRepository = createUserRepositoryWithFindOneMock(jest.mocked(findOneMock));

      const result = await userRepository.findByName(specialName);

      expect(findOneMock).toHaveBeenCalledWith({ name: specialName });
      expect(result).toBe(expectedUser);
    });

    it('should propagate errors thrown by findOne', async () => {
      // This test ensures that errors from findOne are not swallowed and are propagated.
      const error = new Error('Database error');
      const findOneMock = jest.fn().mockRejectedValue(error as never);
      const userRepository = createUserRepositoryWithFindOneMock(jest.mocked(findOneMock));

      await expect(userRepository.findByName('ErrorUser')).rejects.toThrow('Database error');
      expect(findOneMock).toHaveBeenCalledWith({ name: 'ErrorUser' });
    });

    it('should handle very long name strings', async () => {
      // This test checks that very long name strings are handled correctly.
      const longName = 'a'.repeat(1000);
      const findOneMock = jest.fn().mockResolvedValue(null);
      const userRepository = createUserRepositoryWithFindOneMock(jest.mocked(findOneMock));

      const result = await userRepository.findByName(longName);

      expect(findOneMock).toHaveBeenCalledWith({ name: longName });
      expect(result).toBeNull();
    });
  });
});