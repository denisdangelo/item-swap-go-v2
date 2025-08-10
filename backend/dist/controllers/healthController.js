"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHealthCheck = exports.healthCheck = void 0;
const database_1 = require("@/config/database");
const env_1 = require("@/config/env");
const errorHandler_1 = require("@/middleware/errorHandler");
const response_1 = require("@/utils/response");
// Basic health check
exports.healthCheck = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // Test database connection
    const isDatabaseConnected = await (0, database_1.testConnection)();
    // Test Redis connection
    const isRedisConnected = await testRedisConnection();
    const isHealthy = isDatabaseConnected && isRedisConnected;
    const data = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        services: {
            database: isDatabaseConnected ? 'connected' : 'disconnected',
            redis: isRedisConnected ? 'connected' : 'disconnected',
        },
    };
    const statusCode = isHealthy ? 200 : 503;
    (0, response_1.sendSuccess)(res, data, 'Health check completed', statusCode);
});
// Detailed health check (for monitoring systems)
exports.detailedHealthCheck = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const memoryUsage = process.memoryUsage();
    // Test database connection
    const isDatabaseConnected = await (0, database_1.testConnection)();
    // Test Redis connection
    const isRedisConnected = await testRedisConnection();
    const isHealthy = isDatabaseConnected && isRedisConnected;
    const data = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.env.NODE_ENV,
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
            database: isDatabaseConnected ? 'connected' : 'disconnected',
            redis: isRedisConnected ? 'connected' : 'disconnected',
        },
    };
    const statusCode = isHealthy ? 200 : 503;
    (0, response_1.sendSuccess)(res, data, 'Detailed health check', statusCode);
});
