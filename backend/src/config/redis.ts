import Redis from 'ioredis';
import { env } from './env';
import logger from './logger';

// Redis client instance
let redisClient: Redis | null = null;

// Create Redis connection
export const createRedisConnection = (): Redis => {
  if (!redisClient) {
    try {
      redisClient = new Redis(env.REDIS_URL || 'redis://localhost:6379', {
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      redisClient.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      redisClient.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

      redisClient.on('close', () => {
        logger.warn('Redis connection closed');
      });
    } catch (error) {
      logger.error('Failed to create Redis connection:', error);
      throw error;
    }
  }

  return redisClient;
};

// Get Redis client
export const getRedisClient = (): Redis | null => {
  return redisClient;
};

// Test Redis connection
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    const client = createRedisConnection();
    await client.ping();
    logger.info('Redis connection test successful');
    return true;
  } catch (error) {
    logger.error('Redis connection test failed:', error);
    return false;
  }
};

// Close Redis connection
export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
};

// Cache service class
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = createRedisConnection();
  }

  // Set cache with TTL
  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttlSeconds, serializedValue);
    } catch (error) {
      logger.error('Cache set error:', error);
      throw error;
    }
  }

  // Get cache
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  // Delete cache
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
      throw error;
    }
  }

  // Delete multiple keys
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
      throw error;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  // Set TTL for existing key
  async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.expire(key, ttlSeconds);
    } catch (error) {
      logger.error('Cache expire error:', error);
      throw error;
    }
  }

  // Increment counter
  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      logger.error('Cache increment error:', error);
      throw error;
    }
  }

  // Set with expiration if not exists
  async setNX(key: string, value: any, ttlSeconds: number): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      const result = await this.redis.set(key, serializedValue, 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    } catch (error) {
      logger.error('Cache setNX error:', error);
      return false;
    }
  }

  // Get multiple keys
  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.redis.mget(...keys);
      return values.map((value) => (value ? (JSON.parse(value) as T) : null));
    } catch (error) {
      logger.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  // Set multiple keys
  async mset(keyValuePairs: Record<string, any>, ttlSeconds?: number): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();

      Object.entries(keyValuePairs).forEach(([key, value]) => {
        const serializedValue = JSON.stringify(value);
        if (ttlSeconds) {
          pipeline.setex(key, ttlSeconds, serializedValue);
        } else {
          pipeline.set(key, serializedValue);
        }
      });

      await pipeline.exec();
    } catch (error) {
      logger.error('Cache mset error:', error);
      throw error;
    }
  }

  // Hash operations
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.hset(key, field, serializedValue);
    } catch (error) {
      logger.error('Cache hset error:', error);
      throw error;
    }
  }

  async hget<T = any>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.redis.hget(key, field);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache hget error:', error);
      return null;
    }
  }

  async hgetall<T = any>(key: string): Promise<Record<string, T>> {
    try {
      const hash = await this.redis.hgetall(key);
      const result: Record<string, T> = {};

      Object.entries(hash).forEach(([field, value]) => {
        result[field] = JSON.parse(value) as T;
      });

      return result;
    } catch (error) {
      logger.error('Cache hgetall error:', error);
      return {};
    }
  }

  // List operations
  async lpush(key: string, ...values: any[]): Promise<number> {
    try {
      const serializedValues = values.map((v) => JSON.stringify(v));
      return await this.redis.lpush(key, ...serializedValues);
    } catch (error) {
      logger.error('Cache lpush error:', error);
      throw error;
    }
  }

  async lrange<T = any>(key: string, start: number, stop: number): Promise<T[]> {
    try {
      const values = await this.redis.lrange(key, start, stop);
      return values.map((value) => JSON.parse(value) as T);
    } catch (error) {
      logger.error('Cache lrange error:', error);
      return [];
    }
  }

  // Set operations
  async sadd(key: string, ...members: any[]): Promise<number> {
    try {
      const serializedMembers = members.map((m) => JSON.stringify(m));
      return await this.redis.sadd(key, ...serializedMembers);
    } catch (error) {
      logger.error('Cache sadd error:', error);
      throw error;
    }
  }

  async smembers<T = any>(key: string): Promise<T[]> {
    try {
      const members = await this.redis.smembers(key);
      return members.map((member) => JSON.parse(member) as T);
    } catch (error) {
      logger.error('Cache smembers error:', error);
      return [];
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();
