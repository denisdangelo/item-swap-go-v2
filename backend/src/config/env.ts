import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment validation schema (simplified)
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3001'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('3306'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),

  // Auth (no JWT/refresh required in simplified app)
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().optional(),
  REFRESH_TOKEN_SECRET: z.string().optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().optional(),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Redis removed in simplified app
  REDIS_URL: z.string().optional(),

  // File Upload
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'), // 5MB

  // AWS S3 (optional)
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
});

// Validate and export environment variables
export const env = envSchema.parse(process.env);

// Type for environment variables
export type Environment = z.infer<typeof envSchema>;

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
