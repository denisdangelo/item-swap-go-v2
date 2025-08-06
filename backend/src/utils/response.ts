import { Response } from 'express';

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Success response helper
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  res.status(statusCode).json(response);
};

// Paginated response helper
export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    pagination,
    ...(message && { message }),
  };

  res.status(statusCode).json(response);
};

// Created response helper
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): void => {
  sendSuccess(res, data, message, 201);
};

// No content response helper
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

// Error response helper
export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: any
): void => {
  const response = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };

  res.status(statusCode).json(response);
};
