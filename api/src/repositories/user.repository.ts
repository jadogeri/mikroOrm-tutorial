/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description User repository for handling user-related database operations
 * 
 */

import { User } from '../entities/user.entity';
import { inject } from 'inversify';
import { Repository } from '../decorators';
import { UserRepositoryInterface } from '../interfaces/user-repository.interface';
import { TYPES } from '../types/di.type';
import { EntityRepository, SqlEntityManager } from '@mikro-orm/sqlite';

    
@Repository()
export class UserRepository extends EntityRepository<User>  implements UserRepositoryInterface {
  
  // The constructor matches the required signature for Inversify DI
  constructor(@inject(TYPES.SqlEntityManager) entityManager: SqlEntityManager) {
    super(entityManager, User);
  }
/**
 * Retrieves a user by their name from the database.
 * 
 * @param name - The name of the user to find.
 * @returns A Promise that resolves to the User object if found, or null otherwise.
 * @throws May throw an error if the database query fails.
 */
  async findByName(name: string): Promise<User | null> {
    return await this.findOne({ name });
  }
/**
 * Retrieves a user by their email address.
 * 
 * @param email - The email of the user to find.
 * @returns A Promise resolving to the User object if found, otherwise null.
 * @throws May throw an error if the database query fails.
 */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  } 
    
}

