import { asyncHandler } from '@/middleware/errorHandler';
import { AuthService } from '@/services/AuthService';
import { UserService } from '@/services/UserService';
import { sendCreated, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

// Simplified: no Zod. We'll accept body as-is for demo purposes.

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  // Register new user
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);

    sendCreated(res, result, 'User registered successfully');
  });

  // Login user
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);

    sendSuccess(res, result, 'Login successful');
  });

  // Refresh access token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    throw new Error('Refresh token not supported in simplified auth');
  });

  // Logout user
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.authService.logout();

    sendSuccess(res, null, 'Logout successful');
  });

  // Logout from all devices
  logoutAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.authService.logoutAll();

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
    const { current_password, new_password } = req.body;
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
