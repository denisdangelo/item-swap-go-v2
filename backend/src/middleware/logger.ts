import logger from '@/config/logger';
import { NextFunction, Request, Response } from 'express';

// HTTP request logging middleware
export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Log request
  logger.http(`${req.method} ${req.originalUrl} - ${req.ip}`);

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any): Response {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};
