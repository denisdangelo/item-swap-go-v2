"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = exports.AuthMiddleware = void 0;
const AuthService_1 = require("@/services/AuthService");
const errorHandler_1 = require("./errorHandler");
class AuthMiddleware {
    constructor() {
        // Authenticate user (required)
        this.authenticate = async (req, res, next) => {
            try {
                const token = this.extractToken(req);
                if (!token) {
                    throw new errorHandler_1.AuthenticationError('Access token is required');
                }
                const payload = await this.authService.verifyAccessToken(token);
                req.user = {
                    userId: payload.userId,
                    email: payload.email,
                };
                next();
            }
            catch (error) {
                next(error);
            }
        };
        // Optional authentication (user may or may not be authenticated)
        this.optionalAuthenticate = async (req, res, next) => {
            try {
                const token = this.extractToken(req);
                if (token) {
                    const payload = await this.authService.verifyAccessToken(token);
                    req.user = {
                        userId: payload.userId,
                        email: payload.email,
                    };
                }
                next();
            }
            catch (error) {
                // For optional auth, we don't throw errors, just continue without user
                next();
            }
        };
        this.authService = new AuthService_1.AuthService();
    }
    // Extract token from request (now expects sessionToken = userId)
    extractToken(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return null;
        // Accept either "Bearer <userId>" or raw token (userId)
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        }
        return authHeader;
    }
}
exports.AuthMiddleware = AuthMiddleware;
// Create singleton instance
const authMiddleware = new AuthMiddleware();
// Export middleware functions
exports.authenticate = authMiddleware.authenticate;
exports.optionalAuthenticate = authMiddleware.optionalAuthenticate;
