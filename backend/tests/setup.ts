import { closePool, testConnection } from '@/config/database';
import logger from '@/config/logger';
import { runMigrations } from '@/config/migrations';

// Test database setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = 'empresta_ae_test';

  // Test database connection
  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error('Test database connection failed');
  }

  // Run migrations
  await runMigrations();

  logger.info('Test database setup completed');
});

// Cleanup after all tests
afterAll(async () => {
  await closePool();
  logger.info('Test database cleanup completed');
});

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
};
