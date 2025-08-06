import { env, isProduction } from '@/config/env';
import logger from '@/config/logger';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { httpLogger } from '@/middleware/logger';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Import routes
import apiRoutes from '@/routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
          },
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      })
    );

    // Compression middleware
    this.app.use(compression());

    // Rate limiting
    if (isProduction) {
      const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests from this IP, please try again later.',
          },
        },
        standardHeaders: true,
        legacyHeaders: false,
      });

      this.app.use(limiter);
    }

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // HTTP request logging
    this.app.use(httpLogger);

    // Trust proxy (for production deployment behind reverse proxy)
    if (isProduction) {
      this.app.set('trust proxy', 1);
    }
  }

  private initializeRoutes(): void {
    // Serve static files (uploaded images)
    this.app.use('/uploads', express.static(env.UPLOAD_DIR));

    // API routes
    this.app.use('/api', apiRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        data: {
          message: 'Empresta aê API',
          version: '1.0.0',
          environment: env.NODE_ENV,
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
          environment: env.NODE_ENV,
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

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 CORS Origin: ${env.CORS_ORIGIN}`);

      if (!isProduction) {
        logger.info(`🔗 Health Check: http://localhost:${env.PORT}/health`);
        logger.info(`🔗 API Docs: http://localhost:${env.PORT}/api`);
      }
    });
  }
}

export default App;
