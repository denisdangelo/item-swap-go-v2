import logger from '@/config/logger';
import { NextFunction, Request, Response } from 'express';

// Cache middleware options
interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyGenerator?: (req: Request) => string;
  condition?: (req: Request) => boolean;
  skipCache?: (req: Request) => boolean;
}

// Default cache key generator
const defaultKeyGenerator = (req: Request): string => {
  const userId = req.user?.userId || 'anonymous';
  const method = req.method;
  const path = req.path;
  const query = JSON.stringify(req.query);
  return `cache:${method}:${path}:${userId}:${Buffer.from(query).toString('base64')}`;
};

// Cache middleware factory
export const cache = (options: CacheOptions = {}) => {
  const {
    ttl = 300, // 5 minutes default
    keyGenerator = defaultKeyGenerator,
    condition = () => true,
    skipCache = () => false,
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Skip cache for non-GET requests by default
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache if condition not met
    if (!condition(req) || skipCache(req)) {
      return next();
    }

    try {
      const cacheKey = keyGenerator(req);

      // Redis cache disabled in simplified app; passthrough
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache invalidation middleware
export const invalidateCache = (patterns: string[] | ((req: Request) => string[])) => {
  return async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Cache invalidation is disabled
    next();
  };
};

// Specific cache middleware for different endpoints
export const cacheItems = cache({
  ttl: 600, // 10 minutes
  keyGenerator: (req) => {
    const query = JSON.stringify(req.query);
    return `items:search:${Buffer.from(query).toString('base64')}`;
  },
});

export const cacheCategories = cache({
  ttl: 3600, // 1 hour
  keyGenerator: () => 'categories:all',
});

export const cacheUserProfile = cache({
  ttl: 300, // 5 minutes
  keyGenerator: (req) => `user:profile:${req.params.id || req.user?.userId}`,
});

export const cacheItemDetails = cache({
  ttl: 600, // 10 minutes
  keyGenerator: (req) => `item:details:${req.params.id}`,
});

// Cache invalidation patterns
export const invalidateItemsCache = invalidateCache(['items:*']);
export const invalidateCategoriesCache = invalidateCache(['categories:*']);
export const invalidateUserCache = (userId?: string) =>
  invalidateCache([userId ? `user:profile:${userId}` : 'user:profile:*']);

// Rate limiting with Redis
export const rateLimit = (_options: { windowMs: number; max: number; keyGenerator?: (req: Request) => string }) => {
  // Rate limiting disabled in simplified app
  return async (_req: Request, _res: Response, next: NextFunction): Promise<void> => next();
};

// Session cache
export const sessionCache = {
  // No-op session cache in simplified app
  setUserSession: async (_userId: string, _sessionData: any, _ttl: number = 3600): Promise<void> => {},
  getUserSession: async <T = any>(_userId: string): Promise<T | null> => null,
  deleteUserSession: async (_userId: string): Promise<void> => {},
  setTempData: async (_key: string, _data: any, _ttl: number = 600): Promise<void> => {},
  getTempData: async <T = any>(_key: string): Promise<T | null> => null,
  deleteTempData: async (_key: string): Promise<void> => {},
};
