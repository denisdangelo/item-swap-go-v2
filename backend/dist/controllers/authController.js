"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = exports.changePassword = exports.me = exports.logoutAll = exports.logout = exports.refreshToken = exports.login = exports.register = exports.AuthController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const AuthService_1 = require("@/services/AuthService");
const UserService_1 = require("@/services/UserService");
const response_1 = require("@/utils/response");
// Simplified: no Zod. We'll accept body as-is for demo purposes.
class AuthController {
    constructor() {
        // Register new user
        this.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const result = await this.authService.register(req.body);
            (0, response_1.sendCreated)(res, result, 'User registered successfully');
        });
        // Login user
        this.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const result = await this.authService.login(req.body);
            (0, response_1.sendSuccess)(res, result, 'Login successful');
        });
        // Refresh access token
        this.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            throw new Error('Refresh token not supported in simplified auth');
        });
        // Logout user
        this.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            await this.authService.logout();
            (0, response_1.sendSuccess)(res, null, 'Logout successful');
        });
        // Logout from all devices
        this.logoutAll = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            await this.authService.logoutAll();
            (0, response_1.sendSuccess)(res, null, 'Logged out from all devices');
        });
        // Get current user profile
        this.me = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const profile = await this.userService.getProfile(userId);
            (0, response_1.sendSuccess)(res, profile, 'Profile retrieved successfully');
        });
        // Change password
        this.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { current_password, new_password } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.authService.changePassword(userId, current_password, new_password);
            (0, response_1.sendSuccess)(res, null, 'Password changed successfully');
        });
        // Check if email is available
        this.checkEmail = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const email = req.query.email;
            if (!email) {
                throw new Error('Email parameter is required');
            }
            const isAvailable = await this.userService.isEmailAvailable(email);
            (0, response_1.sendSuccess)(res, { available: isAvailable }, 'Email availability checked');
        });
        this.authService = new AuthService_1.AuthService();
        this.userService = new UserService_1.UserService();
    }
}
exports.AuthController = AuthController;
// Create controller instance
const authController = new AuthController();
// Export controller methods
exports.register = authController.register;
exports.login = authController.login;
exports.refreshToken = authController.refreshToken;
exports.logout = authController.logout;
exports.logoutAll = authController.logoutAll;
exports.me = authController.me;
exports.changePassword = authController.changePassword;
exports.checkEmail = authController.checkEmail;
