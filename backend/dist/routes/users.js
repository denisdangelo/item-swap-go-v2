"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("@/controllers/userController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Public routes
router.get('/search', userController_1.searchUsers);
router.get('/nearby', userController_1.getNearbyUsers);
router.get('/:id', auth_1.optionalAuthenticate, userController_1.getProfile);
router.get('/:id/stats', userController_1.getUserStats);
// Protected routes
router.put('/profile', auth_1.authenticate, userController_1.updateProfile);
router.put('/location', auth_1.authenticate, userController_1.updateLocation);
router.put('/avatar', auth_1.authenticate, userController_1.updateAvatar);
router.post('/verify-email', auth_1.authenticate, userController_1.verifyEmail);
router.post('/deactivate', auth_1.authenticate, userController_1.deactivateAccount);
router.delete('/account', auth_1.authenticate, userController_1.deleteAccount);
exports.default = router;
