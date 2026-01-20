/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Database service interface for handling database operations
 * 
 */

import { MikroORM, IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";

export interface DatabaseServiceInterface {

  connect(): Promise<void> ;
  disconnect(): Promise<void> ;
  getMikroORM (): MikroORM<IDatabaseDriver<Connection>, EntityManager<IDatabaseDriver<Connection>>> | null ;
  
}