import { testConnection } from '@/config/database';
import { env } from '@/config/env';
import { asyncHandler } from '@/middleware/errorHandler';
import { sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

// Health check data interface
interface HealthCheckData {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: 'connected' | 'disconnected' | 'unknown';
  };
}

// Basic health check
export const healthCheck = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Test database connection
  const isDatabaseConnected = await testConnection();

  const isHealthy = isDatabaseConnected;

  const data: HealthCheckData = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: isDatabaseConnected ? 'connected' : 'disconnected',
    },
  };

  const statusCode = isHealthy ? 200 : 503;
  sendSuccess(res, data, 'Health check completed', statusCode);
});

// Detailed health check (for monitoring systems)
export const detailedHealthCheck = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const memoryUsage = process.memoryUsage();

    // Test database connection
    const isDatabaseConnected = await testConnection();

    const isHealthy = isDatabaseConnected;

    const data = {
      status: isHealthy ? ('healthy' as const) : ('unhealthy' as const),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
      },
      services: {
        database: isDatabaseConnected ? ('connected' as const) : ('disconnected' as const),
      },
    };

    const statusCode = isHealthy ? 200 : 503;
    sendSuccess(res, data, 'Detailed health check', statusCode);
  }
);
