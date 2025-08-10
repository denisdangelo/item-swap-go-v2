import { testConnection } from '@/config/database';
import logger from '@/config/logger';
import { runMigrations } from '@/config/migrations';

async function migrate() {
  try {
    logger.info('🔄 Starting database migration...');

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Run migrations
    await runMigrations();

    logger.info('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
