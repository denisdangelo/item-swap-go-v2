"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const LoanRepository_1 = require("@/repositories/LoanRepository");
const ReviewRepository_1 = require("@/repositories/ReviewRepository");
const UserRepository_1 = require("@/repositories/UserRepository");
class ReviewService {
    constructor() {
        this.reviewRepository = new ReviewRepository_1.ReviewRepository();
        this.loanRepository = new LoanRepository_1.LoanRepository();
        this.userRepository = new UserRepository_1.UserRepository();
    }
    // Create new review
    async createReview(reviewData, reviewerId) {
        // Validate review data
        this.validateReviewData(reviewData);
        // Check if loan exists and is completed
        const loan = await this.loanRepository.findById(reviewData.loan_id);
        if (!loan) {
            throw new errorHandler_1.NotFoundError('Loan not found');
        }
        if (loan.status !== 'completed') {
            throw new errorHandler_1.ValidationError('Can only review completed loans');
        }
        // Check if reviewer is part of the loan
        if (loan.borrower_id !== reviewerId && loan.lender_id !== reviewerId) {
            throw new errorHandler_1.AuthorizationError('You can only review loans you participated in');
        }
        // Check if reviewed user is the other party in the loan
        const expectedReviewedId = loan.borrower_id === reviewerId ? loan.lender_id : loan.borrower_id;
        if (reviewData.reviewed_id !== expectedReviewedId) {
            throw new errorHandler_1.ValidationError('You can only review the other party in the loan');
        }
        // Determine review type
        const reviewType = loan.borrower_id === reviewerId ? 'borrower_to_lender' : 'lender_to_borrower';
        if (reviewData.type !== reviewType) {
            throw new errorHandler_1.ValidationError(`Review type must be ${reviewType} for this loan`);
        }
        // Check if review already exists
        const existingReview = await this.reviewRepository.existsForLoanAndReviewer(reviewData.loan_id, reviewerId, reviewType);
        if (existingReview) {
            throw new errorHandler_1.ConflictError('You have already reviewed this loan');
        }
        // Check if reviewed user exists
        const reviewedUser = await this.userRepository.findById(reviewData.reviewed_id);
        if (!reviewedUser) {
            throw new errorHandler_1.NotFoundError('Reviewed user not found');
        }
        // Create review
        const review = await this.reviewRepository.create(reviewData, reviewerId);
        // Return review with details
        const reviewWithDetails = await this.reviewRepository.findWithDetails(review.id);
        if (!reviewWithDetails) {
            throw new Error('Failed to retrieve created review');
        }
        return reviewWithDetails;
    }
    // Get review by ID
    async getReviewById(id) {
        const review = await this.reviewRepository.findWithDetails(id);
        if (!review) {
            throw new errorHandler_1.NotFoundError('Review not found');
        }
        return review;
    }
    // Update review
    async updateReview(id, updateData, userId) {
        // Check if review exists
        const existingReview = await this.reviewRepository.findById(id);
        if (!existingReview) {
            throw new errorHandler_1.NotFoundError('Review not found');
        }
        // Check if user owns the review
        if (existingReview.reviewer_id !== userId) {
            throw new errorHandler_1.AuthorizationError('You can only update your own reviews');
        }
        // Validate update data
        if (updateData.rating !== undefined) {
            this.validateRating(updateData.rating);
        }
        if (updateData.comment !== undefined) {
            this.validateComment(updateData.comment);
        }
        // Update review
        await this.reviewRepository.update(id, updateData);
        // Return updated review
        const updatedReview = await this.reviewRepository.findWithDetails(id);
        if (!updatedReview) {
            throw new Error('Failed to retrieve updated review');
        }
        return updatedReview;
    }
    // Delete review
    async deleteReview(id, userId) {
        // Check if review exists
        const review = await this.reviewRepository.findById(id);
        if (!review) {
            throw new errorHandler_1.NotFoundError('Review not found');
        }
        // Check if user owns the review
        if (review.reviewer_id !== userId) {
            throw new errorHandler_1.AuthorizationError('You can only delete your own reviews');
        }
        // Delete review
        const success = await this.reviewRepository.delete(id);
        if (!success) {
            throw new Error('Failed to delete review');
        }
    }
    // Get user reviews (reviews about the user)
    async getUserReviews(userId) {
        // Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        return this.reviewRepository.findUserReviewsWithDetails(userId);
    }
    // Get reviews by reviewer
    async getReviewsByReviewer(reviewerId) {
        return this.reviewRepository.findByReviewer(reviewerId);
    }
    // Get reviews by loan
    async getReviewsByLoan(loanId) {
        // Check if loan exists
        const loan = await this.loanRepository.findById(loanId);
        if (!loan) {
            throw new errorHandler_1.NotFoundError('Loan not found');
        }
        return this.reviewRepository.findByLoan(loanId);
    }
    // Get user rating statistics
    async getUserRatingStats(userId) {
        // Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        return this.reviewRepository.getUserRatingStats(userId);
    }
    // Get recent reviews for user
    async getRecentReviews(userId, limit = 10) {
        // Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        if (limit < 1 || limit > 50) {
            throw new errorHandler_1.ValidationError('Limit must be between 1 and 50');
        }
        return this.reviewRepository.getRecentReviews(userId, limit);
    }
    // Check if user can review loan
    async canReviewLoan(loanId, reviewerId) {
        // Check if loan exists
        const loan = await this.loanRepository.findById(loanId);
        if (!loan) {
            return { canReview: false, reason: 'Loan not found' };
        }
        // Check if loan is completed
        if (loan.status !== 'completed') {
            return { canReview: false, reason: 'Loan must be completed to review' };
        }
        // Check if reviewer is part of the loan
        if (loan.borrower_id !== reviewerId && loan.lender_id !== reviewerId) {
            return { canReview: false, reason: 'You can only review loans you participated in' };
        }
        // Determine review type
        const reviewType = loan.borrower_id === reviewerId ? 'borrower_to_lender' : 'lender_to_borrower';
        // Check if review already exists
        const existingReview = await this.reviewRepository.existsForLoanAndReviewer(loanId, reviewerId, reviewType);
        if (existingReview) {
            return { canReview: false, reason: 'You have already reviewed this loan' };
        }
        return { canReview: true, reviewType };
    }
    // Validate review data
    validateReviewData(data) {
        this.validateRating(data.rating);
        if (data.comment) {
            this.validateComment(data.comment);
        }
        if (!['borrower_to_lender', 'lender_to_borrower'].includes(data.type)) {
            throw new errorHandler_1.ValidationError('Invalid review type');
        }
    }
    // Validate rating
    validateRating(rating) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new errorHandler_1.ValidationError('Rating must be an integer between 1 and 5');
        }
    }
    // Validate comment
    validateComment(comment) {
        if (comment.trim().length === 0) {
            throw new errorHandler_1.ValidationError('Comment cannot be empty');
        }
        if (comment.length > 1000) {
            throw new errorHandler_1.ValidationError('Comment cannot exceed 1000 characters');
        }
        // Basic profanity/inappropriate content check (simplified)
        const inappropriateWords = ['spam', 'scam']; // In real app, use a proper filter
        const lowerComment = comment.toLowerCase();
        for (const word of inappropriateWords) {
            if (lowerComment.includes(word)) {
                throw new errorHandler_1.ValidationError('Comment contains inappropriate content');
            }
        }
    }
}
exports.ReviewService = ReviewService;
