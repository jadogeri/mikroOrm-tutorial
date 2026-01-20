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
  async findByName(name: string): Promise<User | null> {
    return await this.findOne({ name });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  } 
    
}

