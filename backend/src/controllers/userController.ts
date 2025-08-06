import { asyncHandler } from '@/middleware/errorHandler';
import { UserService } from '@/services/UserService';
import { sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schemas
const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name too long')
    .optional(),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  location_address: z.string().max(500, 'Address too long').optional(),
});

const updateLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().max(500, 'Address too long').optional(),
});

const searchUsersSchema = z.object({
  search: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  radius: z.number().min(1).max(100).optional(),
});

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Get user profile
  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id || req.user?.userId;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const profile = await this.userService.getProfile(userId);

    sendSuccess(res, profile, 'Profile retrieved successfully');
  });

  // Update user profile
  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const validatedData = updateProfileSchema.parse(req.body);

    const updatedProfile = await this.userService.updateProfile(userId, validatedData);

    sendSuccess(res, updatedProfile, 'Profile updated successfully');
  });

  // Update user location
  updateLocation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const validatedData = updateLocationSchema.parse(req.body);

    const updatedProfile = await this.userService.updateLocation(userId, validatedData);

    sendSuccess(res, updatedProfile, 'Location updated successfully');
  });

  // Update user avatar
  updateAvatar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const { avatar_url } = req.body;

    if (!avatar_url) {
      throw new Error('Avatar URL is required');
    }

    const updatedProfile = await this.userService.updateAvatar(userId, avatar_url);

    sendSuccess(res, updatedProfile, 'Avatar updated successfully');
  });

  // Search users
  searchUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedQuery = searchUsersSchema.parse(req.query);

    const searchOptions: any = {};

    if (validatedQuery.search) {
      searchOptions.search = validatedQuery.search;
    }

    if (validatedQuery.lat && validatedQuery.lng) {
      searchOptions.location = {
        lat: validatedQuery.lat,
        lng: validatedQuery.lng,
      };

      if (validatedQuery.radius) {
        searchOptions.radius = validatedQuery.radius;
      }
    }

    const users = await this.userService.searchUsers(searchOptions);

    sendSuccess(res, users, 'Users retrieved successfully');
  });

  // Get users near location
  getNearbyUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : 10;

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Valid latitude and longitude are required');
    }

    const users = await this.userService.getUsersNearLocation(lat, lng, radius);

    sendSuccess(res, users, 'Nearby users retrieved successfully');
  });

  // Get user statistics
  getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id || req.user?.userId;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const stats = await this.userService.getUserStats(userId);

    sendSuccess(res, stats, 'User statistics retrieved successfully');
  });

  // Verify user email
  verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.userService.verifyEmail(userId);

    sendSuccess(res, null, 'Email verified successfully');
  });

  // Deactivate account
  deactivateAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.userService.deactivateAccount(userId);

    sendSuccess(res, null, 'Account deactivated successfully');
  });

  // Delete account
  deleteAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.userService.deleteAccount(userId);

    sendSuccess(res, null, 'Account deleted successfully');
  });
}

// Create controller instance
const userController = new UserController();

// Export controller methods
export const getProfile = userController.getProfile;
export const updateProfile = userController.updateProfile;
export const updateLocation = userController.updateLocation;
export const updateAvatar = userController.updateAvatar;
export const searchUsers = userController.searchUsers;
export const getNearbyUsers = userController.getNearbyUsers;
export const getUserStats = userController.getUserStats;
export const verifyEmail = userController.verifyEmail;
export const deactivateAccount = userController.deactivateAccount;
export const deleteAccount = userController.deleteAccount;
