// src/ioc.config.ts
import { Container, decorate, injectable } from 'inversify';
import { Controller } from 'tsoa';
import { buildProviderModule } from "inversify-binding-decorators";
import { TYPES } from '../types/di.type';
import { UserControllerInterface } from '../interfaces/user-controller.interface';
import { UserController } from '../controllers/user.controller';
import { SqlEntityManager } from '@mikro-orm/sqlite';
import { UserRepositoryInterface } from '../interfaces/user-repository.interface';
import { UserServiceInterface } from '../interfaces/user-service.interface';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { DatabaseServiceInterface } from '../interfaces/database-service.interface';
import { SQLiteService } from '../services/sqlite.service';



export const iocContainer = new Container();

decorate(injectable(), Controller); 
iocContainer.load(buildProviderModule());

  //  0. bind controllers
  
    iocContainer.bind<UserControllerInterface>(UserController).toSelf();

    // 1. Bind the service that manages the connection
    iocContainer.bind<SQLiteService>(SQLiteService).toSelf().inSingletonScope();
    iocContainer.bind<DatabaseServiceInterface>(TYPES.DatabaseServiceInterface).to(SQLiteService).inSingletonScope();
    iocContainer.bind<UserServiceInterface>(TYPES.UserServiceInterface).to(UserService).inSingletonScope();


    // 2. Bind the Repository (it will wait for TYPES.DataSource to be available)
    iocContainer.bind<UserRepositoryInterface>(TYPES.UserRepositoryInterface).to(UserRepository).inSingletonScope();


// 3. Helper to bind the live DataSource after connection

export const bindSqlEntityManager =(sqlEntityManager: SqlEntityManager) => {
  console.log("Binding new SqlEntityManager...");
  const binding = iocContainer.bind<SqlEntityManager>(TYPES.SqlEntityManager).toConstantValue(sqlEntityManager);
  console.log("SqlEntityManager bound successfully.");
  console.log("Returning SqlEntityManager binding:", binding);
  return binding;
};







