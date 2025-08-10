"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const UserRepository_1 = require("@/repositories/UserRepository");
class AuthService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    // Register new user
    async register(userData) {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new errorHandler_1.ConflictError('User with this email already exists');
        }
        // Create user
        const user = await this.userRepository.create(userData);
        return this.generateSimpleSession(user);
    }
    // Login user
    async login(credentials) {
        const { email, password } = credentials;
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new errorHandler_1.AuthenticationError('Invalid email or password');
        }
        // Check if user is active
        if (!user.is_active) {
            throw new errorHandler_1.AuthenticationError('Account is deactivated');
        }
        // Verify password
        const isPasswordValid = await this.userRepository.verifyPassword(user, password);
        if (!isPasswordValid) {
            throw new errorHandler_1.AuthenticationError('Invalid email or password');
        }
        return this.generateSimpleSession(user);
    }
    // No refresh token in simplified flow
    async refreshToken() {
        throw new errorHandler_1.AuthenticationError('Refresh token not supported');
    }
    // Logout user
    async logout() { }
    // Logout from all devices
    async logoutAll() { }
    // Verify access token
    async verifyAccessToken(token) {
        // Simplified: expect token to be the userId
        const user = await this.userRepository.findById(token);
        if (!user || !user.is_active) {
            throw new errorHandler_1.AuthenticationError('User not found or inactive');
        }
        return { userId: user.id, email: user.email };
    }
    // Change password
    async changePassword(userId, _currentPassword, newPassword) {
        // Simplified: directly set new password
        await this.userRepository.updatePassword(userId, newPassword);
    }
    // Generate simple session token (userId-as-token)
    async generateSimpleSession(user) {
        const { password_hash, ...userWithoutPassword } = user;
        return {
            sessionToken: user.id,
            user: userWithoutPassword,
        };
    }
    // No password strength rules in simplified flow
    validatePassword(_password) { }
    // Not used in simplified flow
    parseTimeToMs(_timeString) {
        return 0;
    }
    // Not used in simplified flow
    async cleanExpiredTokens() {
        return 0;
    }
}
exports.AuthService = AuthService;
