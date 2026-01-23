import { SqlEntityManager } from "@mikro-orm/sqlite";
import { User } from '../../src/entities/user.entity';
import { UserRepository } from '../../src/repositories/user.repository';
import { jest, describe, it, expect } from "@jest/globals";






// Manual mock for SqlEntityManager
const mockSqlEntityManager = {
  // Add any methods if needed in future
} as unknown as jest.Mocked<SqlEntityManager>;

// Manual mock for EntityRepository (since UserRepository extends it)

// Patch UserRepository to use the mock EntityRepository for testing
class TestUserRepository extends UserRepository {
  constructor(entityManager: SqlEntityManager) {
    super(entityManager as any);
    // Override findOne with a jest mock
    (this as any).findOne = jest.fn();
  }
}

describe('UserRepository.findByEmail() findByEmail method', () => {
  let userRepository: TestUserRepository;

  beforeEach(() => {
    userRepository = new TestUserRepository(mockSqlEntityManager as any);
  });

  //
  // Happy Path Tests
  //
  describe('Happy Paths', () => {
    it('should return a User when a user with the given email exists', async () => {
      // This test ensures that a valid user is returned when found by email.
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      } as any;

      jest.mocked((userRepository as any).findOne).mockResolvedValue(mockUser as any as never);

      const result = await userRepository.findByEmail('john@example.com');

      expect((userRepository as any).findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(result).toBe(mockUser);
    });

    it('should call findOne with the correct filter object', async () => {
      // This test ensures that findOne is called with the correct filter query.
      const mockUser: User = {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@domain.com',
      } as any;

      jest.mocked((userRepository as any).findOne).mockResolvedValue(mockUser as any as never);

      await userRepository.findByEmail('jane@domain.com');

      expect((userRepository as any).findOne).toHaveBeenCalledWith({ email: 'jane@domain.com' });
    });
  });

  //
  // Edge Case Tests
  //
  describe('Edge Cases', () => {
    it('should return null when no user with the given email exists', async () => {
      // This test ensures that null is returned if no user is found.
      jest.mocked((userRepository as any).findOne).mockResolvedValue(null);

      const result = await userRepository.findByEmail('notfound@example.com');

      expect((userRepository as any).findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
      expect(result).toBeNull();
    });

    it('should handle emails with special characters', async () => {
      // This test ensures that emails with special characters are handled correctly.
      const specialEmail = 'user+test@sub.domain.co.uk';
      const mockUser: User = {
        id: 3,
        name: 'Special Char',
        email: specialEmail,
      } as any;

      jest.mocked((userRepository as any).findOne).mockResolvedValue(mockUser as any as never);

      const result = await userRepository.findByEmail(specialEmail);

      expect((userRepository as any).findOne).toHaveBeenCalledWith({ email: specialEmail });
      expect(result).toBe(mockUser);
    });

    it('should handle empty string as email', async () => {
      // This test ensures that an empty string email is handled and passed to findOne.
      jest.mocked((userRepository as any).findOne).mockResolvedValue(null);

      const result = await userRepository.findByEmail('');

      expect((userRepository as any).findOne).toHaveBeenCalledWith({ email: '' });
      expect(result).toBeNull();
    });

    it('should handle very long email addresses', async () => {
      // This test ensures that very long emails are handled without error.
      const longEmail = 'a'.repeat(200) + '@example.com';
      const mockUser: User = {
        id: 4,
        name: 'Long Email',
        email: longEmail,
      } as any;

      jest.mocked((userRepository as any).findOne).mockResolvedValue(mockUser as any as never);

      const result = await userRepository.findByEmail(longEmail);

      expect((userRepository as any).findOne).toHaveBeenCalledWith({ email: longEmail });
      expect(result).toBe(mockUser);
    });

    it('should propagate errors thrown by findOne', async () => {
      // This test ensures that if findOne throws, the error is propagated.
      const error = new Error('Database error');
      jest.mocked((userRepository as any).findOne).mockRejectedValue(error as never);

      await expect(userRepository.findByEmail('error@domain.com')).rejects.toThrow('Database error');
      expect((userRepository as any).findOne).toHaveBeenCalledWith({ email: 'error@domain.com' });
    });
  });
});