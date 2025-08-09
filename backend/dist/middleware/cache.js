"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCache = exports.rateLimit = exports.invalidateUserCache = exports.invalidateCategoriesCache = exports.invalidateItemsCache = exports.cacheItemDetails = exports.cacheUserProfile = exports.cacheCategories = exports.cacheItems = exports.invalidateCache = exports.cache = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const redis_1 = require("@/config/redis");
// Default cache key generator
const defaultKeyGenerator = (req) => {
    const userId = req.user?.userId || 'anonymous';
    const method = req.method;
    const path = req.path;
    const query = JSON.stringify(req.query);
    return `cache:${method}:${path}:${userId}:${Buffer.from(query).toString('base64')}`;
};
// Cache middleware factory
const cache = (options = {}) => {
    const { ttl = 300, // 5 minutes default
    keyGenerator = defaultKeyGenerator, condition = () => true, skipCache = () => false, } = options;
    return async (req, res, next) => {
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
            const cachedData = await redis_1.cacheService.get(cacheKey);
            if (cachedData) {
                logger_1.default.debug(`Cache hit for key: ${cacheKey}`);
                return res.json(cachedData);
            }
            logger_1.default.debug(`Cache miss for key: ${cacheKey}`);
            // Store original json method
            const originalJson = res.json;
            // Override json method to cache response
            res.json = function (data) {
                // Cache successful responses only
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redis_1.cacheService.set(cacheKey, data, ttl).catch((error) => {
                        logger_1.default.error('Failed to cache response:', error);
                    });
                }
                // Call original json method
                return originalJson.call(this, data);
            };
            next();
        }
        catch (error) {
            logger_1.default.error('Cache middleware error:', error);
            next();
        }
    };
};
exports.cache = cache;
// Cache invalidation middleware
const invalidateCache = (patterns) => {
    return async (req, res, next) => {
        // Store original json method
        const originalJson = res.json;
        // Override json method to invalidate cache after successful response
        res.json = function (data) {
            // Invalidate cache for successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const patternsToInvalidate = typeof patterns === 'function' ? patterns(req) : patterns;
                Promise.all(patternsToInvalidate.map((pattern) => redis_1.cacheService.delPattern(pattern))).catch((error) => {
                    logger_1.default.error('Failed to invalidate cache:', error);
                });
            }
            // Call original json method
            return originalJson.call(this, data);
        };
        next();
    };
};
exports.invalidateCache = invalidateCache;
// Specific cache middleware for different endpoints
exports.cacheItems = (0, exports.cache)({
    ttl: 600, // 10 minutes
    keyGenerator: (req) => {
        const query = JSON.stringify(req.query);
        return `items:search:${Buffer.from(query).toString('base64')}`;
    },
});
exports.cacheCategories = (0, exports.cache)({
    ttl: 3600, // 1 hour
    keyGenerator: () => 'categories:all',
});
exports.cacheUserProfile = (0, exports.cache)({
    ttl: 300, // 5 minutes
    keyGenerator: (req) => `user:profile:${req.params.id || req.user?.userId}`,
});
exports.cacheItemDetails = (0, exports.cache)({
    ttl: 600, // 10 minutes
    keyGenerator: (req) => `item:details:${req.params.id}`,
});
// Cache invalidation patterns
exports.invalidateItemsCache = (0, exports.invalidateCache)(['items:*']);
exports.invalidateCategoriesCache = (0, exports.invalidateCache)(['categories:*']);
const invalidateUserCache = (userId) => (0, exports.invalidateCache)([userId ? `user:profile:${userId}` : 'user:profile:*']);
exports.invalidateUserCache = invalidateUserCache;
// Rate limiting with Redis
const rateLimit = (options) => {
    const { windowMs, max, keyGenerator = (req) => `rate_limit:${req.ip}` } = options;
    return async (req, res, next) => {
        try {
            const key = keyGenerator(req);
            const current = await redis_1.cacheService.incr(key);
            if (current === 1) {
                await redis_1.cacheService.expire(key, Math.ceil(windowMs / 1000));
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
        }
        catch (error) {
            logger_1.default.error('Rate limit middleware error:', error);
            next();
        }
    };
};
exports.rateLimit = rateLimit;
// Session cache
exports.sessionCache = {
    // Store user session data
    setUserSession: async (userId, sessionData, ttl = 3600) => {
        await redis_1.cacheService.set(`session:${userId}`, sessionData, ttl);
    },
    // Get user session data
    getUserSession: async (userId) => {
        return redis_1.cacheService.get(`session:${userId}`);
    },
    // Delete user session
    deleteUserSession: async (userId) => {
        await redis_1.cacheService.del(`session:${userId}`);
    },
    // Store temporary data (like email verification codes)
    setTempData: async (key, data, ttl = 600) => {
        await redis_1.cacheService.set(`temp:${key}`, data, ttl);
    },
    // Get temporary data
    getTempData: async (key) => {
        return redis_1.cacheService.get(`temp:${key}`);
    },
    // Delete temporary data
    deleteTempData: async (key) => {
        await redis_1.cacheService.del(`temp:${key}`);
    },
};
