/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description configuration of MikroORM
 * 
 */
import { User } from '../entities/user.entity';
import { defineConfig, SqliteDriver } from '@mikro-orm/sqlite';
import { Migrator } from '@mikro-orm/migrations'; // Install @mikro-orm/migrations

export const microOrmConfig = defineConfig({
    dbName: 'user.sqlite',
    entities: [User],
    entitiesTs: ['src/entities/**/*.ts'], // Required for discovery via ts-node
    driver: SqliteDriver,

    // 1. Logging
    debug: ['query', 'query-params'], // Options: 'query', 'query-params', 'discovery', 'info', etc.
    
    // 2. Synchronize (Auto-generate schema on start)
    // Warning: Only use in development; it can delete data if entities change.
    allowGlobalContext: true,
    extensions: [Migrator], // Register Migrator extension
    
    // 3. Migrations Configuration
    migrations: {
        path: 'src/migrations', // Path to your migration files
        glob: '!(*.d).{js,ts}', 
        transactional: true,    // Run each migration in a transaction
        allOrNothing: true,     // Roll back everything if one migration fails
    },

    // 4. Subscribers
    //subscribers: [new MySubscriber()], // Register your EventSubscriber instances
});
