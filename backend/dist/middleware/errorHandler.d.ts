import { NextFunction, Request, Response } from 'express';
export declare abstract class AppError extends Error {
    context?: any;
    abstract statusCode: number;
    abstract isOperational: boolean;
    constructor(message: string, context?: any);
}
export declare class ValidationError extends AppError {
    statusCode: number;
    isOperational: boolean;
}
export declare class AuthenticationError extends AppError {
    statusCode: number;
    isOperational: boolean;
}
export declare class AuthorizationError extends AppError {
    statusCode: number;
    isOperational: boolean;
}
export declare class NotFoundError extends AppError {
    statusCode: number;
    isOperational: boolean;
}
export declare class ConflictError extends AppError {
    statusCode: number;
    isOperational: boolean;
}
export declare class InternalServerError extends AppError {
    statusCode: number;
    isOperational: boolean;
}
export declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response) => void;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
