    import { Response, Request } from "express";
    
    export function noRouteFoundHandler(_req: Request, res: Response) {
    res.status(404).send({
        message: "No Route Found",
    });
    }