// src/ioc.config.ts
import { Container, decorate, injectable } from 'inversify';
import { Controller } from 'tsoa';
import { buildProviderModule } from "inversify-binding-decorators";
import { TYPES } from '../types/di.type';



const iocContainer = new Container();

decorate(injectable(), Controller); 
iocContainer.load(buildProviderModule());

  //  0. bind controllers
  
const configureIoC = () => {
    iocContainer.bind<UserControllerInterface>(CategoryController).toSelf();

    // 1. Bind the service that manages the connection
    iocContainer.bind<SQLiteService>(SQLiteService).toSelf().inSingletonScope();
    iocContainer.bind<DatabaseServiceInterface>(TYPES.DatabaseServiceInterface).to(SQLiteService).inSingletonScope();
    iocContainer.bind<CategoryServiceInterface>(TYPES.CategoryServiceInterface).to(CategoryService).inSingletonScope();


    // 2. Bind the Repository (it will wait for TYPES.DataSource to be available)
    iocContainer.bind<CategoryRepositoryInterface>(TYPES.CategoryRepositoryInterface).to(CategoryRepository).inSingletonScope();
}


// 3. Helper to bind the live DataSource after connection

export const bindDataSource =(dataSource: DataSource) => {
  if (iocContainer.isBound(TYPES.DataSource)) {
    console.log("DataSource is already bound. Unbinding the existing one.");
    console.log("Unbinding DataSource...");
    iocContainer.unbind(TYPES.DataSource);
  }
  console.log("Binding new DataSource...");
  const binding = iocContainer.bind<DataSource>(TYPES.DataSource).toConstantValue(dataSource);
  console.log("DataSource bound successfully.");
  console.log("Returning DataSource binding:", binding);
  return binding;
};



export { iocContainer, configureIoC};




