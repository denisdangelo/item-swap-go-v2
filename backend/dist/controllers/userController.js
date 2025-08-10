"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.deactivateAccount = exports.verifyEmail = exports.getUserStats = exports.getNearbyUsers = exports.searchUsers = exports.updateAvatar = exports.updateLocation = exports.updateProfile = exports.getProfile = exports.UserController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const UserService_1 = require("@/services/UserService");
const response_1 = require("@/utils/response");
const zod_1 = require("zod");
// Validation schemas
const updateProfileSchema = zod_1.z.object({
    first_name: zod_1.z
        .string()
        .min(1, 'First name is required')
        .max(100, 'First name too long')
        .optional(),
    last_name: zod_1.z.string().min(1, 'Last name is required').max(100, 'Last name too long').optional(),
    phone: zod_1.z.string().max(20, 'Phone number too long').optional(),
    bio: zod_1.z.string().max(500, 'Bio too long').optional(),
    location_lat: zod_1.z.number().min(-90).max(90).optional(),
    location_lng: zod_1.z.number().min(-180).max(180).optional(),
    location_address: zod_1.z.string().max(500, 'Address too long').optional(),
});
const updateLocationSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    address: zod_1.z.string().max(500, 'Address too long').optional(),
});
const searchUsersSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    lat: zod_1.z.number().min(-90).max(90).optional(),
    lng: zod_1.z.number().min(-180).max(180).optional(),
    radius: zod_1.z.number().min(1).max(100).optional(),
});
class UserController {
    constructor() {
        // Get user profile
        this.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.id || req.user?.userId;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const profile = await this.userService.getProfile(userId);
            (0, response_1.sendSuccess)(res, profile, 'Profile retrieved successfully');
        });
        // Update user profile
        this.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const validatedData = updateProfileSchema.parse(req.body);
            const updatedProfile = await this.userService.updateProfile(userId, validatedData);
            (0, response_1.sendSuccess)(res, updatedProfile, 'Profile updated successfully');
        });
        // Update user location
        this.updateLocation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const validatedData = updateLocationSchema.parse(req.body);
            const updatedProfile = await this.userService.updateLocation(userId, validatedData);
            (0, response_1.sendSuccess)(res, updatedProfile, 'Location updated successfully');
        });
        // Update user avatar
        this.updateAvatar = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const { avatar_url } = req.body;
            if (!avatar_url) {
                throw new Error('Avatar URL is required');
            }
            const updatedProfile = await this.userService.updateAvatar(userId, avatar_url);
            (0, response_1.sendSuccess)(res, updatedProfile, 'Avatar updated successfully');
        });
        // Search users
        this.searchUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const validatedQuery = searchUsersSchema.parse(req.query);
            const searchOptions = {};
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
            (0, response_1.sendSuccess)(res, users, 'Users retrieved successfully');
        });
        // Get users near location
        this.getNearbyUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const lat = parseFloat(req.query.lat);
            const lng = parseFloat(req.query.lng);
            const radius = req.query.radius ? parseFloat(req.query.radius) : 10;
            if (isNaN(lat) || isNaN(lng)) {
                throw new Error('Valid latitude and longitude are required');
            }
            const users = await this.userService.getUsersNearLocation(lat, lng, radius);
            (0, response_1.sendSuccess)(res, users, 'Nearby users retrieved successfully');
        });
        // Get user statistics
        this.getUserStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.id || req.user?.userId;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const stats = await this.userService.getUserStats(userId);
            (0, response_1.sendSuccess)(res, stats, 'User statistics retrieved successfully');
        });
        // Verify user email
        this.verifyEmail = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.userService.verifyEmail(userId);
            (0, response_1.sendSuccess)(res, null, 'Email verified successfully');
        });
        // Deactivate account
        this.deactivateAccount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.userService.deactivateAccount(userId);
            (0, response_1.sendSuccess)(res, null, 'Account deactivated successfully');
        });
        // Delete account
        this.deleteAccount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.userService.deleteAccount(userId);
            (0, response_1.sendSuccess)(res, null, 'Account deleted successfully');
        });
        this.userService = new UserService_1.UserService();
    }
}
exports.UserController = UserController;
// Create controller instance
const userController = new UserController();
// Export controller methods
exports.getProfile = userController.getProfile;
exports.updateProfile = userController.updateProfile;
exports.updateLocation = userController.updateLocation;
exports.updateAvatar = userController.updateAvatar;
exports.searchUsers = userController.searchUsers;
exports.getNearbyUsers = userController.getNearbyUsers;
exports.getUserStats = userController.getUserStats;
exports.verifyEmail = userController.verifyEmail;
exports.deactivateAccount = userController.deactivateAccount;
exports.deleteAccount = userController.deleteAccount;
