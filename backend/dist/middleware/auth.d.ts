import { NextFunction, Request, Response } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}
export declare class AuthMiddleware {
    private authService;
    constructor();
    authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private extractToken;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
