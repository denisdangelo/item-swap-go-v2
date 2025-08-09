import { Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, statusCode?: number) => void;
export declare const sendPaginatedSuccess: <T>(res: Response, data: T[], pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}, message?: string, statusCode?: number) => void;
export declare const sendCreated: <T>(res: Response, data: T, message?: string) => void;
export declare const sendNoContent: (res: Response) => void;
export declare const sendError: (res: Response, code: string, message: string, statusCode?: number, details?: any) => void;
