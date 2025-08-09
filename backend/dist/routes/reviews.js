"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviewController_1 = require("@/controllers/reviewController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Public routes
router.get('/user/:userId', reviewController_1.getUserReviews);
router.get('/user/:userId/stats', reviewController_1.getUserRatingStats);
router.get('/user/:userId/recent', reviewController_1.getRecentReviews);
// Protected routes
router.post('/', auth_1.authenticate, reviewController_1.createReview);
router.get('/:id', auth_1.optionalAuthenticate, reviewController_1.getReviewById);
router.put('/:id', auth_1.authenticate, reviewController_1.updateReview);
router.delete('/:id', auth_1.authenticate, reviewController_1.deleteReview);
// User-specific routes
router.get('/reviewer/me', auth_1.authenticate, reviewController_1.getReviewsByReviewer);
// Loan-specific routes
router.get('/loan/:loanId', reviewController_1.getReviewsByLoan);
router.get('/loan/:loanId/can-review', auth_1.authenticate, reviewController_1.canReviewLoan);
exports.default = router;
