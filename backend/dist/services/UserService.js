"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const UserRepository_1 = require("@/repositories/UserRepository");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    // Get user profile
    async getProfile(userId) {
        const profile = await this.userRepository.getProfile(userId);
        if (!profile) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        return profile;
    }
    // Update user profile
    async updateProfile(userId, updateData) {
        // Check if user exists
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        // Validate location data
        if (updateData.location_lat !== undefined || updateData.location_lng !== undefined) {
            this.validateLocation(updateData.location_lat, updateData.location_lng);
        }
        // Update user
        await this.userRepository.update(userId, updateData);
        // Return updated profile
        const updatedProfile = await this.userRepository.getProfile(userId);
        if (!updatedProfile) {
            throw new errorHandler_1.NotFoundError('Failed to retrieve updated profile');
        }
        return updatedProfile;
    }
    // Update user location
    async updateLocation(userId, location) {
        this.validateLocation(location.lat, location.lng);
        const updateData = {
            location_lat: location.lat,
            location_lng: location.lng,
            location_address: location.address,
        };
        return this.updateProfile(userId, updateData);
    }
    // Upload user avatar
    async updateAvatar(userId, avatarUrl) {
        if (!avatarUrl || avatarUrl.trim() === '') {
            throw new errorHandler_1.ValidationError('Avatar URL is required');
        }
        return this.updateProfile(userId, { avatar_url: avatarUrl });
    }
    // Get user by ID
    async getUserById(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        return user;
    }
    // Search users
    async searchUsers(options) {
        if (options.search) {
            return this.userRepository.searchByName(options.search);
        }
        if (options.location) {
            const radius = options.radius || 10; // Default 10km radius
            return this.userRepository.findByLocation(options.location.lat, options.location.lng, radius);
        }
        return [];
    }
    // Get users near location
    async getUsersNearLocation(lat, lng, radiusKm = 10) {
        this.validateLocation(lat, lng);
        return this.userRepository.findByLocation(lat, lng, radiusKm);
    }
    // Get user statistics
    async getUserStats(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        return this.userRepository.getUserStats(userId);
    }
    // Verify user email
    async verifyEmail(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        if (user.is_verified) {
            throw new errorHandler_1.ConflictError('Email is already verified');
        }
        const success = await this.userRepository.verifyEmail(userId);
        if (!success) {
            throw new Error('Failed to verify email');
        }
    }
    // Deactivate user account
    async deactivateAccount(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        if (!user.is_active) {
            throw new errorHandler_1.ConflictError('Account is already deactivated');
        }
        const success = await this.userRepository.deactivate(userId);
        if (!success) {
            throw new Error('Failed to deactivate account');
        }
    }
    // Activate user account
    async activateAccount(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        if (user.is_active) {
            throw new errorHandler_1.ConflictError('Account is already active');
        }
        const success = await this.userRepository.activate(userId);
        if (!success) {
            throw new Error('Failed to activate account');
        }
    }
    // Delete user account (soft delete)
    async deleteAccount(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        // Soft delete by deactivating
        await this.deactivateAccount(userId);
    }
    // Check if email is available
    async isEmailAvailable(email) {
        const user = await this.userRepository.findByEmail(email);
        return !user;
    }
    // Validate location coordinates
    validateLocation(lat, lng) {
        if (lat !== undefined && (lat < -90 || lat > 90)) {
            throw new errorHandler_1.ValidationError('Latitude must be between -90 and 90');
        }
        if (lng !== undefined && (lng < -180 || lng > 180)) {
            throw new errorHandler_1.ValidationError('Longitude must be between -180 and 180');
        }
        if ((lat !== undefined && lng === undefined) || (lat === undefined && lng !== undefined)) {
            throw new errorHandler_1.ValidationError('Both latitude and longitude must be provided');
        }
    }
}
exports.UserService = UserService;
