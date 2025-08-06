import { asyncHandler } from '@/middleware/errorHandler';
import { AuthService } from '@/services/AuthService';
import { UserService } from '@/services/UserService';
import { sendCreated, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  location_address: z.string().max(500, 'Address too long').optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  // Register new user
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = registerSchema.parse(req.body);

    const result = await this.authService.register(validatedData);

    sendCreated(res, result, 'User registered successfully');
  });

  // Login user
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = loginSchema.parse(req.body);

    const result = await this.authService.login(validatedData);

    sendSuccess(res, result, 'Login successful');
  });

  // Refresh access token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refresh_token } = refreshTokenSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const result = await this.authService.refreshToken(refresh_token, userId);

    sendSuccess(res, result, 'Token refreshed successfully');
  });

  // Logout user
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refresh_token } = refreshTokenSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.authService.logout(refresh_token, userId);

    sendSuccess(res, null, 'Logout successful');
  });

  // Logout from all devices
  logoutAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.authService.logoutAll(userId);

    sendSuccess(res, null, 'Logged out from all devices');
  });

  // Get current user profile
  me = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const profile = await this.userService.getProfile(userId);

    sendSuccess(res, profile, 'Profile retrieved successfully');
  });

  // Change password
  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { current_password, new_password } = changePasswordSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.authService.changePassword(userId, current_password, new_password);

    sendSuccess(res, null, 'Password changed successfully');
  });

  // Check if email is available
  checkEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const email = req.query.email as string;

    if (!email) {
      throw new Error('Email parameter is required');
    }

    // Validate email format
    z.string().email().parse(email);

    const isAvailable = await this.userService.isEmailAvailable(email);

    sendSuccess(res, { available: isAvailable }, 'Email availability checked');
  });
}

// Create controller instance
const authController = new AuthController();

// Export controller methods
export const register = authController.register;
export const login = authController.login;
export const refreshToken = authController.refreshToken;
export const logout = authController.logout;
export const logoutAll = authController.logoutAll;
export const me = authController.me;
export const changePassword = authController.changePassword;
export const checkEmail = authController.checkEmail;
