import mysql from 'mysql2/promise';
import { env } from './env';
import logger from './logger';

// Database connection pool
let pool: mysql.Pool | null = null;

// Create connection pool
export const createPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: '+00:00',
    });

    logger.info('Database connection pool created');
  }

  return pool;
};

// Get database connection
export const getConnection = async (): Promise<mysql.PoolConnection> => {
  const dbPool = createPool();
  return await dbPool.getConnection();
};

// Execute query with connection handling
export const executeQuery = async <T = any>(query: string, params?: any[]): Promise<T> => {
  const connection = await getConnection();

  try {
    const [rows] = await connection.execute(query, params);
    return rows as T;
  } finally {
    connection.release();
  }
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
};

// Close database pool
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database connection pool closed');
  }
};
