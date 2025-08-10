import { asyncHandler } from '@/middleware/errorHandler';
import { ReviewService } from '@/services/ReviewService';
import { sendCreated, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schemas
const createReviewSchema = z.object({
  loan_id: z.string().min(1, 'Loan ID is required'),
  reviewed_id: z.string().min(1, 'Reviewed user ID is required'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000, 'Comment too long').optional(),
  type: z.enum(['borrower_to_lender', 'lender_to_borrower']),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000, 'Comment too long').optional(),
});

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  // Create new review
  createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const validatedData = createReviewSchema.parse(req.body);

    const review = await this.reviewService.createReview(validatedData, userId);

    sendCreated(res, review, 'Review created successfully');
  });

  // Get review by ID
  getReviewById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const review = await this.reviewService.getReviewById(id);

    sendSuccess(res, review, 'Review retrieved successfully');
  });

  // Update review
  updateReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const validatedData = updateReviewSchema.parse(req.body);

    const review = await this.reviewService.updateReview(id, validatedData, userId);

    sendSuccess(res, review, 'Review updated successfully');
  });

  // Delete review
  deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.reviewService.deleteReview(id, userId);

    sendSuccess(res, null, 'Review deleted successfully');
  });

  // Get user reviews
  getUserReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const reviews = await this.reviewService.getUserReviews(userId);

    sendSuccess(res, reviews, 'User reviews retrieved successfully');
  });

  // Get reviews by reviewer
  getReviewsByReviewer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const reviews = await this.reviewService.getReviewsByReviewer(userId);

    sendSuccess(res, reviews, 'Reviewer reviews retrieved successfully');
  });

  // Get reviews by loan
  getReviewsByLoan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { loanId } = req.params;

    const reviews = await this.reviewService.getReviewsByLoan(loanId);

    sendSuccess(res, reviews, 'Loan reviews retrieved successfully');
  });

  // Get user rating statistics
  getUserRatingStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const stats = await this.reviewService.getUserRatingStats(userId);

    sendSuccess(res, stats, 'User rating statistics retrieved successfully');
  });

  // Get recent reviews
  getRecentReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const reviews = await this.reviewService.getRecentReviews(userId, limit);

    sendSuccess(res, reviews, 'Recent reviews retrieved successfully');
  });

  // Check if user can review loan
  canReviewLoan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { loanId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const result = await this.reviewService.canReviewLoan(loanId, userId);

    sendSuccess(res, result, 'Review eligibility checked successfully');
  });
}

// Create controller instance
const reviewController = new ReviewController();

// Export controller methods
export const createReview = reviewController.createReview;
export const getReviewById = reviewController.getReviewById;
export const updateReview = reviewController.updateReview;
export const deleteReview = reviewController.deleteReview;
export const getUserReviews = reviewController.getUserReviews;
export const getReviewsByReviewer = reviewController.getReviewsByReviewer;
export const getReviewsByLoan = reviewController.getReviewsByLoan;
export const getUserRatingStats = reviewController.getUserRatingStats;
export const getRecentReviews = reviewController.getRecentReviews;
export const canReviewLoan = reviewController.canReviewLoan;
