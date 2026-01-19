import { MikroORM } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { Options } from '@mikro-orm/sqlite'; // Use `type` import for Options


const microOrmConfig: Options = {
    dbName: 'user.sqlite', // Your SQLite database file
    entities: [User],
};

export const microOrm =  new MikroORM(microOrmConfig);

    