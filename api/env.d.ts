
import { NodeEnvironment } from "./src/types/node-environment.type";

declare global {
    namespace Express {
        export interface Request {
            payload?: any, // Add the user property to the Request interface
            body: any,
        }
    }
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: NodeEnvironment;
            // DATASOURCE_TYPE:MongoConnectionOptions["type"];
            // DATASOURCE_HOST:MongoConnectionOptions["host"] 
            // DATASOURCE_PORT:MongoConnectionOptions["port"]
            // DATASOURCE_DATABASE:MongoConnectionOptions["database"]
            COMPANY:string;
            LOGO_URL:string;
            // PORT:number;
            // NANOID_SIZE:number;
            // BCRYPT_SALT_ROUNDS:number|string;
            NODEMAILER_USERNAME : string;
            NODEMAILER_PASSWORD : string;
            ACCESS_TOKEN_SECRET :string;
            REFRESH_TOKEN_SECRET :string;
            ACCESS_TOKEN_EXPIRES_IN : string;
            REFRESH_TOKEN_EXPIRES_IN : string;
            ROOT_USERNAME: string;
            ROOT_EMAIL: string;
            ROOT_PASSWORD: string;
            TEST_DATABASE_URL : string;
            PROD_DATABASE_URL : string;
            DEV_DATABASE_URL : string;
            TURSO_DATABASE_URL : string;
            TURSO_AUTH_TOKEN : string;
            SYNCRONIZE_DB : string ;
        }
    }
}

export {}