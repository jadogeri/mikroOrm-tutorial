import { MikroORM, IDatabaseDriver, Connection, EntityManager } from "@mikro-orm/core";

export interface DatabaseServiceInterface {

  connect(): Promise<void> ;
  disconnect(): Promise<void> ;
  getMikroORM (): MikroORM<IDatabaseDriver<Connection>, EntityManager<IDatabaseDriver<Connection>>> | null ;
  
}