import { AuthService } from '@/services/AuthService';
import { NextFunction, Request, Response } from 'express';
import { AuthenticationError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Authenticate user (required)
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        throw new AuthenticationError('Access token is required');
      }

      const payload = await this.authService.verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  // Optional authentication (user may or may not be authenticated)
  optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      if (token) {
        const payload = await this.authService.verifyAccessToken(token);
        req.user = {
          userId: payload.userId,
          email: payload.email,
        };
      }
      next();
    } catch (error) {
      // For optional auth, we don't throw errors, just continue without user
      next();
    }
  };

  // Extract token from request (now expects sessionToken = userId)
  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    // Accept either "Bearer <userId>" or raw token (userId)
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return authHeader;
  }
}

// Create singleton instance
const authMiddleware = new AuthMiddleware();

// Export middleware functions
export const authenticate = authMiddleware.authenticate;
export const optionalAuthenticate = authMiddleware.optionalAuthenticate;
