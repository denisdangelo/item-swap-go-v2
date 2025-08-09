"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = exports.closeRedisConnection = exports.testRedisConnection = exports.getRedisClient = exports.createRedisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
// Redis client instance
let redisClient = null;
// Create Redis connection
const createRedisConnection = () => {
    if (!redisClient) {
        try {
            redisClient = new ioredis_1.default(env_1.env.REDIS_URL || 'redis://localhost:6379', {
                retryDelayOnFailover: 100,
                enableReadyCheck: false,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
            });
            redisClient.on('connect', () => {
                logger_1.default.info('Redis connected successfully');
            });
            redisClient.on('error', (error) => {
                logger_1.default.error('Redis connection error:', error);
            });
            redisClient.on('close', () => {
                logger_1.default.warn('Redis connection closed');
            });
        }
        catch (error) {
            logger_1.default.error('Failed to create Redis connection:', error);
            throw error;
        }
    }
    return redisClient;
};
exports.createRedisConnection = createRedisConnection;
// Get Redis client
const getRedisClient = () => {
    return redisClient;
};
exports.getRedisClient = getRedisClient;
// Test Redis connection
const testRedisConnection = async () => {
    try {
        const client = (0, exports.createRedisConnection)();
        await client.ping();
        logger_1.default.info('Redis connection test successful');
        return true;
    }
    catch (error) {
        logger_1.default.error('Redis connection test failed:', error);
        return false;
    }
};
exports.testRedisConnection = testRedisConnection;
// Close Redis connection
const closeRedisConnection = async () => {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger_1.default.info('Redis connection closed');
    }
};
exports.closeRedisConnection = closeRedisConnection;
// Cache service class
class CacheService {
    constructor() {
        this.redis = (0, exports.createRedisConnection)();
    }
    // Set cache with TTL
    async set(key, value, ttlSeconds = 3600) {
        try {
            const serializedValue = JSON.stringify(value);
            await this.redis.setex(key, ttlSeconds, serializedValue);
        }
        catch (error) {
            logger_1.default.error('Cache set error:', error);
            throw error;
        }
    }
    // Get cache
    async get(key) {
        try {
            const value = await this.redis.get(key);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            logger_1.default.error('Cache get error:', error);
            return null;
        }
    }
    // Delete cache
    async del(key) {
        try {
            await this.redis.del(key);
        }
        catch (error) {
            logger_1.default.error('Cache delete error:', error);
            throw error;
        }
    }
    // Delete multiple keys
    async delPattern(pattern) {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (error) {
            logger_1.default.error('Cache delete pattern error:', error);
            throw error;
        }
    }
    // Check if key exists
    async exists(key) {
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        }
        catch (error) {
            logger_1.default.error('Cache exists error:', error);
            return false;
        }
    }
    // Set TTL for existing key
    async expire(key, ttlSeconds) {
        try {
            await this.redis.expire(key, ttlSeconds);
        }
        catch (error) {
            logger_1.default.error('Cache expire error:', error);
            throw error;
        }
    }
    // Increment counter
    async incr(key) {
        try {
            return await this.redis.incr(key);
        }
        catch (error) {
            logger_1.default.error('Cache increment error:', error);
            throw error;
        }
    }
    // Set with expiration if not exists
    async setNX(key, value, ttlSeconds) {
        try {
            const serializedValue = JSON.stringify(value);
            const result = await this.redis.set(key, serializedValue, 'EX', ttlSeconds, 'NX');
            return result === 'OK';
        }
        catch (error) {
            logger_1.default.error('Cache setNX error:', error);
            return false;
        }
    }
    // Get multiple keys
    async mget(keys) {
        try {
            const values = await this.redis.mget(...keys);
            return values.map((value) => (value ? JSON.parse(value) : null));
        }
        catch (error) {
            logger_1.default.error('Cache mget error:', error);
            return keys.map(() => null);
        }
    }
    // Set multiple keys
    async mset(keyValuePairs, ttlSeconds) {
        try {
            const pipeline = this.redis.pipeline();
            Object.entries(keyValuePairs).forEach(([key, value]) => {
                const serializedValue = JSON.stringify(value);
                if (ttlSeconds) {
                    pipeline.setex(key, ttlSeconds, serializedValue);
                }
                else {
                    pipeline.set(key, serializedValue);
                }
            });
            await pipeline.exec();
        }
        catch (error) {
            logger_1.default.error('Cache mset error:', error);
            throw error;
        }
    }
    // Hash operations
    async hset(key, field, value) {
        try {
            const serializedValue = JSON.stringify(value);
            await this.redis.hset(key, field, serializedValue);
        }
        catch (error) {
            logger_1.default.error('Cache hset error:', error);
            throw error;
        }
    }
    async hget(key, field) {
        try {
            const value = await this.redis.hget(key, field);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            logger_1.default.error('Cache hget error:', error);
            return null;
        }
    }
    async hgetall(key) {
        try {
            const hash = await this.redis.hgetall(key);
            const result = {};
            Object.entries(hash).forEach(([field, value]) => {
                result[field] = JSON.parse(value);
            });
            return result;
        }
        catch (error) {
            logger_1.default.error('Cache hgetall error:', error);
            return {};
        }
    }
    // List operations
    async lpush(key, ...values) {
        try {
            const serializedValues = values.map((v) => JSON.stringify(v));
            return await this.redis.lpush(key, ...serializedValues);
        }
        catch (error) {
            logger_1.default.error('Cache lpush error:', error);
            throw error;
        }
    }
    async lrange(key, start, stop) {
        try {
            const values = await this.redis.lrange(key, start, stop);
            return values.map((value) => JSON.parse(value));
        }
        catch (error) {
            logger_1.default.error('Cache lrange error:', error);
            return [];
        }
    }
    // Set operations
    async sadd(key, ...members) {
        try {
            const serializedMembers = members.map((m) => JSON.stringify(m));
            return await this.redis.sadd(key, ...serializedMembers);
        }
        catch (error) {
            logger_1.default.error('Cache sadd error:', error);
            throw error;
        }
    }
    async smembers(key) {
        try {
            const members = await this.redis.smembers(key);
            return members.map((member) => JSON.parse(member));
        }
        catch (error) {
            logger_1.default.error('Cache smembers error:', error);
            return [];
        }
    }
}
exports.CacheService = CacheService;
// Export singleton instance
exports.cacheService = new CacheService();
