"reflect-metadata";

import "./controllers/user.controller.js";
import express, { Request, Response, Application } from 'express';
import { corsOptions } from "./configs/cors.config.js"
import cors from "cors";
import { RegisterRoutes } from "./routes.js";
import path from "node:path";
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


  app.get('/home', (req: Request, res: Response) => {
    res.send('Hello World with TypeScript and Express!');
  });
  
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'get received successfully' });
  });

  app.post('/', (req: Request, res: Response) => {
    res.json({ message: 'post received successfully' });
  });

  app.delete('/', (req: Request, res: Response) => {
    res.json({ message: 'delete received successfully' });
  });

  app.put('/', (req: Request, res: Response) => {
    res.json({ message: 'put received successfully' });
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




