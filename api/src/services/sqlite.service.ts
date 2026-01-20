import { DatabaseServiceInterface } from "../interfaces/database-service.interface.js";
import { microOrmConfig } from "../configs/mikro-orm.config.js";
import { Service } from "../decorators.js";
import { MikroORM, IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";


@Service()
export class SQLiteService implements DatabaseServiceInterface{
  
  private orm!: MikroORM;   
  
  constructor() { }

    /**
   * Initializes the ORM instance and establishes the connection.
   * This is the MikroORM equivalent of TypeORM's DataSource.initialize().
   */
  async connect(): Promise<void> {
    try {
      // MikroORM.init is the proper way to create the "DataSource"
      this.orm = await MikroORM.init(microOrmConfig);
    // This will create the tables if they don't exist
      await this.orm.schema.updateSchema(); 
      console.log('🛢️ SQLite Database connected successfully');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }

  /**
   * Closes the database connection pool.
   */
  async disconnect(): Promise<void> {
    if (this.orm || await this.orm.isConnected()) {
      console.log("🛢️ SQLite3 Database disconnected.");
      await this.orm.close();
    }
  }

  /**
   * Returns the initialized MikroORM instance.
   * Use this to access the EntityManager: device.getMikroORM().em
   */
  public getMikroORM(): MikroORM<IDatabaseDriver<Connection>, EntityManager<IDatabaseDriver<Connection>>> {
    if (!this.orm) {
      throw new Error('ORM not initialized. Call connect() first.');
    }
    return this.orm;
  }


}

export default new SQLiteService();