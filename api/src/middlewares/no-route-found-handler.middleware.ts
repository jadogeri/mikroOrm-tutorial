/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 19-JAN-2026
 * @description No route found handler middleware for handling HTTP 404 Not Found errors
 * 
 */    
    
    import { Response, Request } from "express";
    
    export function noRouteFoundHandler(_req: Request, res: Response) {
    res.status(404).send({
        message: "No Route Found",
    });
    }