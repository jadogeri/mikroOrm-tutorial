"reflect-metadata";
/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description Express application setup for the MikroORM tutorial API
 * 
 */

import "./controllers/user.controller.js";
import express, { Request, Response, Application } from 'express';
import { corsOptions } from "./configs/cors.config.js"
import cors from "cors";
import { RegisterRoutes } from "./routes.js";
import { swaggerOptions } from "./configs/swagger.config.js";
import swaggerJson from "./swagger.json" with { type: 'json' };
import * as swaggerUI from "swagger-ui-express";
import { globalErrorHandler } from "./middlewares/global-error-handler.middleware.js";
import { noRouteFoundHandler } from "./middlewares/no-route-found-handler.middleware.js";

export const buildApp = (): Application => {

  const app: Application = express();  

  // middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));


  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the MikroORM tutorial API!');
  });
  
  RegisterRoutes(app);
  
  app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(swaggerJson));

  app.use(["/openapi", "/docs", "/swagger"],
    swaggerUI.serve,
    swaggerUI.setup(swaggerJson, swaggerOptions)
  );


  app.use(globalErrorHandler);
  app.use(noRouteFoundHandler)
  return app;
}




