import { NextFunction, Request, Response } from 'express';
interface CacheOptions {
    ttl?: number;
    keyGenerator?: (req: Request) => string;
    condition?: (req: Request) => boolean;
    skipCache?: (req: Request) => boolean;
}
export declare const cache: (options?: CacheOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const invalidateCache: (patterns: string[] | ((req: Request) => string[])) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cacheItems: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cacheCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cacheUserProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cacheItemDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const invalidateItemsCache: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const invalidateCategoriesCache: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const invalidateUserCache: (userId?: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rateLimit: (options: {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request) => string;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const sessionCache: {
    setUserSession: (userId: string, sessionData: any, ttl?: number) => Promise<void>;
    getUserSession: <T = any>(userId: string) => Promise<T | null>;
    deleteUserSession: (userId: string) => Promise<void>;
    setTempData: (key: string, data: any, ttl?: number) => Promise<void>;
    getTempData: <T = any>(key: string) => Promise<T | null>;
    deleteTempData: (key: string) => Promise<void>;
};
export {};
