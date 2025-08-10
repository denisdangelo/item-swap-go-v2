"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canReviewLoan = exports.getRecentReviews = exports.getUserRatingStats = exports.getReviewsByLoan = exports.getReviewsByReviewer = exports.getUserReviews = exports.deleteReview = exports.updateReview = exports.getReviewById = exports.createReview = exports.ReviewController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const ReviewService_1 = require("@/services/ReviewService");
const response_1 = require("@/utils/response");
const zod_1 = require("zod");
// Validation schemas
const createReviewSchema = zod_1.z.object({
    loan_id: zod_1.z.string().min(1, 'Loan ID is required'),
    reviewed_id: zod_1.z.string().min(1, 'Reviewed user ID is required'),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().max(1000, 'Comment too long').optional(),
    type: zod_1.z.enum(['borrower_to_lender', 'lender_to_borrower']),
});
const updateReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5).optional(),
    comment: zod_1.z.string().max(1000, 'Comment too long').optional(),
});
class ReviewController {
    constructor() {
        // Create new review
        this.createReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const validatedData = createReviewSchema.parse(req.body);
            const review = await this.reviewService.createReview(validatedData, userId);
            (0, response_1.sendCreated)(res, review, 'Review created successfully');
        });
        // Get review by ID
        this.getReviewById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const review = await this.reviewService.getReviewById(id);
            (0, response_1.sendSuccess)(res, review, 'Review retrieved successfully');
        });
        // Update review
        this.updateReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const validatedData = updateReviewSchema.parse(req.body);
            const review = await this.reviewService.updateReview(id, validatedData, userId);
            (0, response_1.sendSuccess)(res, review, 'Review updated successfully');
        });
        // Delete review
        this.deleteReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.reviewService.deleteReview(id, userId);
            (0, response_1.sendSuccess)(res, null, 'Review deleted successfully');
        });
        // Get user reviews
        this.getUserReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.userId;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const reviews = await this.reviewService.getUserReviews(userId);
            (0, response_1.sendSuccess)(res, reviews, 'User reviews retrieved successfully');
        });
        // Get reviews by reviewer
        this.getReviewsByReviewer = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const reviews = await this.reviewService.getReviewsByReviewer(userId);
            (0, response_1.sendSuccess)(res, reviews, 'Reviewer reviews retrieved successfully');
        });
        // Get reviews by loan
        this.getReviewsByLoan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { loanId } = req.params;
            const reviews = await this.reviewService.getReviewsByLoan(loanId);
            (0, response_1.sendSuccess)(res, reviews, 'Loan reviews retrieved successfully');
        });
        // Get user rating statistics
        this.getUserRatingStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.userId;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const stats = await this.reviewService.getUserRatingStats(userId);
            (0, response_1.sendSuccess)(res, stats, 'User rating statistics retrieved successfully');
        });
        // Get recent reviews
        this.getRecentReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.userId;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const reviews = await this.reviewService.getRecentReviews(userId, limit);
            (0, response_1.sendSuccess)(res, reviews, 'Recent reviews retrieved successfully');
        });
        // Check if user can review loan
        this.canReviewLoan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { loanId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const result = await this.reviewService.canReviewLoan(loanId, userId);
            (0, response_1.sendSuccess)(res, result, 'Review eligibility checked successfully');
        });
        this.reviewService = new ReviewService_1.ReviewService();
    }
}
exports.ReviewController = ReviewController;
// Create controller instance
const reviewController = new ReviewController();
// Export controller methods
exports.createReview = reviewController.createReview;
exports.getReviewById = reviewController.getReviewById;
exports.updateReview = reviewController.updateReview;
exports.deleteReview = reviewController.deleteReview;
exports.getUserReviews = reviewController.getUserReviews;
exports.getReviewsByReviewer = reviewController.getReviewsByReviewer;
exports.getReviewsByLoan = reviewController.getReviewsByLoan;
exports.getUserRatingStats = reviewController.getUserRatingStats;
exports.getRecentReviews = reviewController.getRecentReviews;
exports.canReviewLoan = reviewController.canReviewLoan;
