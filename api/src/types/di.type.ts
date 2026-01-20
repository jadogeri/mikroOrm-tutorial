/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Dependency injection types for the application
 * 
 */

export const TYPES = {
  MikroORM: Symbol.for('MikroORM'),
  SqlEntityManager: Symbol.for('SqlEntityManager'),
  DatabaseServiceInterface: Symbol.for('DatabaseServiceInterface'),
  SQLiteService: Symbol.for('SQLiteService'),
  UserControllerInterface: Symbol.for('UserControllerInterface'), 
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserRepositoryInterface: Symbol.for('UserRepositoryInterface'),
};
