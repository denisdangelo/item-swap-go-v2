import mysql from 'mysql2/promise';
export declare const createPool: () => mysql.Pool;
export declare const getConnection: () => Promise<mysql.PoolConnection>;
export declare const executeQuery: <T = any>(query: string, params?: any[]) => Promise<T>;
export declare const testConnection: () => Promise<boolean>;
export declare const closePool: () => Promise<void>;
