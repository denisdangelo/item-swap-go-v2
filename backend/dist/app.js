"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("@/config/env");
const logger_1 = __importDefault(require("@/config/logger"));
const errorHandler_1 = require("@/middleware/errorHandler");
const logger_2 = require("@/middleware/logger");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// Import routes
const routes_1 = __importDefault(require("@/routes"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        // Security middleware removed for simplified demo
        // CORS configuration
        this.app.use((0, cors_1.default)({
            origin: env_1.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        }));
        // Compression middleware
        this.app.use((0, compression_1.default)());
        // Rate limiting removed for simplified demo
        // Body parsing middleware
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // HTTP request logging
        this.app.use(logger_2.httpLogger);
        // Trust proxy (for production deployment behind reverse proxy)
        if (env_1.isProduction) {
            this.app.set('trust proxy', 1);
        }
    }
    initializeRoutes() {
        // Serve static files (uploaded images)
        this.app.use('/uploads', express_1.default.static(env_1.env.UPLOAD_DIR));
        // API routes
        this.app.use('/api', routes_1.default);
        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                data: {
                    message: 'Empresta aê API',
                    version: '1.0.0',
                    environment: env_1.env.NODE_ENV,
                    timestamp: new Date().toISOString(),
                },
            });
        });
        // API base route
        this.app.get('/api', (req, res) => {
            res.json({
                success: true,
                data: {
                    message: 'Empresta aê API v1',
                    version: '1.0.0',
                    environment: env_1.env.NODE_ENV,
                    timestamp: new Date().toISOString(),
                    endpoints: {
                        health: '/api/health',
                        auth: '/api/auth',
                        users: '/api/users',
                        items: '/api/items',
                        categories: '/api/categories',
                    },
                },
            });
        });
    }
    initializeErrorHandling() {
        // 404 handler
        this.app.use(errorHandler_1.notFoundHandler);
        // Global error handler
        this.app.use(errorHandler_1.errorHandler);
    }
    listen() {
        this.app.listen(env_1.env.PORT, () => {
            logger_1.default.info(`🚀 Server running on port ${env_1.env.PORT}`);
            logger_1.default.info(`📝 Environment: ${env_1.env.NODE_ENV}`);
            logger_1.default.info(`🌐 CORS Origin: ${env_1.env.CORS_ORIGIN}`);
            if (!env_1.isProduction) {
                logger_1.default.info(`🔗 Health Check: http://localhost:${env_1.env.PORT}/health`);
                logger_1.default.info(`🔗 API Docs: http://localhost:${env_1.env.PORT}/api`);
            }
        });
    }
}
exports.default = App;
