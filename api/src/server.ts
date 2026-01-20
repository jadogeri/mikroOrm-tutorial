import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import {buildApp} from "./app.js";
import { bindSqlEntityManager , iocContainer } from "./configs/inversify.config.js";
import { Application } from "express";
import { SQLiteService } from "./services/sqlite.service.js";
import { DatabaseServiceInterface } from "./interfaces/database-service.interface.js";
import { SqlEntityManager } from "@mikro-orm/sqlite";


async function bootstrap() {
  try {
    // A. Resolve the service and connect
    const sqliteService : DatabaseServiceInterface= iocContainer.get<SQLiteService>(SQLiteService);
    
    await sqliteService.connect(); 


    const mikroOrm = sqliteService.getMikroORM();
    const isInitialized = await mikroOrm?.isConnected();
    console.log("DataSource initialized:", isInitialized);              

    // B. Inject the live DataSource into the container
    // This allows Repositories to resolve TYPES.DataSource

    if(isInitialized){
      console.log("✅ MikroORM is connected and ready.");
      const sqlEntityManager = mikroOrm?.em as SqlEntityManager;
    
        bindSqlEntityManager(sqlEntityManager);
    }

    // C. Now start the server
    const app: Application = buildApp();
    const port = process.env.PORT || 3000;   

    if (process.env.NODE_ENV !== 'test') {
      app.listen(port , () => {
        console.log(`🚀 Server is running on: http://localhost:${port}`);
        console.log(`📚 API Documentation: http://localhost:${port}/docs`);
      });
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }

}

await bootstrap();


