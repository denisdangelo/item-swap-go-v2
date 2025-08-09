import Redis from 'ioredis';
export declare const createRedisConnection: () => Redis;
export declare const getRedisClient: () => Redis | null;
export declare const testRedisConnection: () => Promise<boolean>;
export declare const closeRedisConnection: () => Promise<void>;
export declare class CacheService {
    private redis;
    constructor();
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    get<T = any>(key: string): Promise<T | null>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    expire(key: string, ttlSeconds: number): Promise<void>;
    incr(key: string): Promise<number>;
    setNX(key: string, value: any, ttlSeconds: number): Promise<boolean>;
    mget<T = any>(keys: string[]): Promise<(T | null)[]>;
    mset(keyValuePairs: Record<string, any>, ttlSeconds?: number): Promise<void>;
    hset(key: string, field: string, value: any): Promise<void>;
    hget<T = any>(key: string, field: string): Promise<T | null>;
    hgetall<T = any>(key: string): Promise<Record<string, T>>;
    lpush(key: string, ...values: any[]): Promise<number>;
    lrange<T = any>(key: string, start: number, stop: number): Promise<T[]>;
    sadd(key: string, ...members: any[]): Promise<number>;
    smembers<T = any>(key: string): Promise<T[]>;
}
export declare const cacheService: CacheService;
