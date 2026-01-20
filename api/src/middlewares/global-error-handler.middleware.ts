import { Response, Request,NextFunction } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "../errors/http.error";
import { ApiError } from "../errors/api.error";
export const globalErrorHandler = (err : unknown, req : Request, res : Response, next : NextFunction) => {

  console.error(err); 
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if(err instanceof HttpError){
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
        title: err.title,
        message: err.message,
        statusCode: err.statusCode,
        stackTrace: err.stack,
      
    });
  }  
  // Generic internal server error
  return res.status(500).json({
    message: 'An internal server error occurred',
  });

}
