import logger from '@/config/logger';
import { cacheService } from '@/config/redis';
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

      // Try to get from cache
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        logger.debug(`Cache hit for key: ${cacheKey}`);
        return res.json(cachedData);
      }

      logger.debug(`Cache miss for key: ${cacheKey}`);

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache response
      res.json = function (data: any) {
        // Cache successful responses only
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheService.set(cacheKey, data, ttl).catch((error) => {
            logger.error('Failed to cache response:', error);
          });
        }

        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache invalidation middleware
export const invalidateCache = (patterns: string[] | ((req: Request) => string[])) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Store original json method
    const originalJson = res.json;

    // Override json method to invalidate cache after successful response
    res.json = function (data: any) {
      // Invalidate cache for successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const patternsToInvalidate = typeof patterns === 'function' ? patterns(req) : patterns;

        Promise.all(patternsToInvalidate.map((pattern) => cacheService.delPattern(pattern))).catch(
          (error) => {
            logger.error('Failed to invalidate cache:', error);
          }
        );
      }

      // Call original json method
      return originalJson.call(this, data);
    };

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
export const rateLimit = (options: {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
}) => {
  const { windowMs, max, keyGenerator = (req) => `rate_limit:${req.ip}` } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = keyGenerator(req);
      const current = await cacheService.incr(key);

      if (current === 1) {
        await cacheService.expire(key, Math.ceil(windowMs / 1000));
      }

      if (current > max) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.',
          },
        });
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': Math.max(0, max - current).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString(),
      });

      next();
    } catch (error) {
      logger.error('Rate limit middleware error:', error);
      next();
    }
  };
};

// Session cache
export const sessionCache = {
  // Store user session data
  setUserSession: async (userId: string, sessionData: any, ttl: number = 3600): Promise<void> => {
    await cacheService.set(`session:${userId}`, sessionData, ttl);
  },

  // Get user session data
  getUserSession: async <T = any>(userId: string): Promise<T | null> => {
    return cacheService.get<T>(`session:${userId}`);
  },

  // Delete user session
  deleteUserSession: async (userId: string): Promise<void> => {
    await cacheService.del(`session:${userId}`);
  },

  // Store temporary data (like email verification codes)
  setTempData: async (key: string, data: any, ttl: number = 600): Promise<void> => {
    await cacheService.set(`temp:${key}`, data, ttl);
  },

  // Get temporary data
  getTempData: async <T = any>(key: string): Promise<T | null> => {
    return cacheService.get<T>(`temp:${key}`);
  },

  // Delete temporary data
  deleteTempData: async (key: string): Promise<void> => {
    await cacheService.del(`temp:${key}`);
  },
};
