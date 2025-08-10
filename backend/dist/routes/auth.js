"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("@/controllers/authController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/check-email', authController_1.checkEmail);
// Simplified protected routes (no refresh endpoint)
router.post('/logout', auth_1.authenticate, authController_1.logout);
router.post('/logout-all', auth_1.authenticate, authController_1.logoutAll);
router.get('/me', auth_1.authenticate, authController_1.me);
router.post('/change-password', auth_1.authenticate, authController_1.changePassword);
exports.default = router;
