import { createPool, testConnection } from '@/config/database';
import { env } from '@/config/env';
import logger from '@/config/logger';
import App from './app';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
const startServer = async (): Promise<void> => {
  try {
    logger.info('🚀 Starting Empresta aê API server...');
    logger.info(`📝 Environment: ${env.NODE_ENV}`);
    logger.info(`🔧 Port: ${env.PORT}`);

    // Initialize database connection
    logger.info('🔌 Initializing database connection...');
    createPool();

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
    logger.info('✅ Database connection established');

    const app = new App();
    app.listen();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize server
startServer();
