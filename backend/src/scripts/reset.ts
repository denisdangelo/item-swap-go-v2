import { executeQuery, testConnection } from '@/config/database';
import logger from '@/config/logger';
import { runMigrations } from '@/config/migrations';

async function reset() {
  try {
    logger.info('🔄 Starting database reset...');

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Drop all tables
    logger.info('Dropping existing tables...');
    const dropQueries = [
      'SET FOREIGN_KEY_CHECKS = 0',
      'DROP TABLE IF EXISTS refresh_tokens',
      'DROP TABLE IF EXISTS messages',
      'DROP TABLE IF EXISTS reviews',
      'DROP TABLE IF EXISTS loans',
      'DROP TABLE IF EXISTS item_images',
      'DROP TABLE IF EXISTS items',
      'DROP TABLE IF EXISTS categories',
      'DROP TABLE IF EXISTS users',
      'DROP TABLE IF EXISTS migrations',
      'SET FOREIGN_KEY_CHECKS = 1',
    ];

    for (const query of dropQueries) {
      await executeQuery(query);
    }

    logger.info('✅ All tables dropped successfully');

    // Run migrations
    await runMigrations();

    logger.info('✅ Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run reset
reset();
