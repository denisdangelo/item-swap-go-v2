import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/middleware/errorHandler';
import {
  CreateReviewData,
  Review,
  ReviewType,
  ReviewWithDetails,
  UpdateReviewData,
} from '@/models/Review';
import { LoanRepository } from '@/repositories/LoanRepository';
import { ReviewRepository } from '@/repositories/ReviewRepository';
import { UserRepository } from '@/repositories/UserRepository';

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private loanRepository: LoanRepository;
  private userRepository: UserRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.loanRepository = new LoanRepository();
    this.userRepository = new UserRepository();
  }

  // Create new review
  async createReview(reviewData: CreateReviewData, reviewerId: string): Promise<ReviewWithDetails> {
    // Validate review data
    this.validateReviewData(reviewData);

    // Check if loan exists and is completed
    const loan = await this.loanRepository.findById(reviewData.loan_id);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    if (loan.status !== 'completed') {
      throw new ValidationError('Can only review completed loans');
    }

    // Check if reviewer is part of the loan
    if (loan.borrower_id !== reviewerId && loan.lender_id !== reviewerId) {
      throw new AuthorizationError('You can only review loans you participated in');
    }

    // Check if reviewed user is the other party in the loan
    const expectedReviewedId = loan.borrower_id === reviewerId ? loan.lender_id : loan.borrower_id;
    if (reviewData.reviewed_id !== expectedReviewedId) {
      throw new ValidationError('You can only review the other party in the loan');
    }

    // Determine review type
    const reviewType: ReviewType =
      loan.borrower_id === reviewerId ? 'borrower_to_lender' : 'lender_to_borrower';
    if (reviewData.type !== reviewType) {
      throw new ValidationError(`Review type must be ${reviewType} for this loan`);
    }

    // Check if review already exists
    const existingReview = await this.reviewRepository.existsForLoanAndReviewer(
      reviewData.loan_id,
      reviewerId,
      reviewType
    );

    if (existingReview) {
      throw new ConflictError('You have already reviewed this loan');
    }

    // Check if reviewed user exists
    const reviewedUser = await this.userRepository.findById(reviewData.reviewed_id);
    if (!reviewedUser) {
      throw new NotFoundError('Reviewed user not found');
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
  async getReviewById(id: string): Promise<ReviewWithDetails> {
    const review = await this.reviewRepository.findWithDetails(id);
    if (!review) {
      throw new NotFoundError('Review not found');
    }
    return review;
  }

  // Update review
  async updateReview(
    id: string,
    updateData: UpdateReviewData,
    userId: string
  ): Promise<ReviewWithDetails> {
    // Check if review exists
    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview) {
      throw new NotFoundError('Review not found');
    }

    // Check if user owns the review
    if (existingReview.reviewer_id !== userId) {
      throw new AuthorizationError('You can only update your own reviews');
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
  async deleteReview(id: string, userId: string): Promise<void> {
    // Check if review exists
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if user owns the review
    if (review.reviewer_id !== userId) {
      throw new AuthorizationError('You can only delete your own reviews');
    }

    // Delete review
    const success = await this.reviewRepository.delete(id);
    if (!success) {
      throw new Error('Failed to delete review');
    }
  }

  // Get user reviews (reviews about the user)
  async getUserReviews(userId: string): Promise<ReviewWithDetails[]> {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.reviewRepository.findUserReviewsWithDetails(userId);
  }

  // Get reviews by reviewer
  async getReviewsByReviewer(reviewerId: string): Promise<Review[]> {
    return this.reviewRepository.findByReviewer(reviewerId);
  }

  // Get reviews by loan
  async getReviewsByLoan(loanId: string): Promise<Review[]> {
    // Check if loan exists
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    return this.reviewRepository.findByLoan(loanId);
  }

  // Get user rating statistics
  async getUserRatingStats(userId: string): Promise<{
    average_rating: number;
    total_reviews: number;
    rating_distribution: { [key: number]: number };
  }> {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.reviewRepository.getUserRatingStats(userId);
  }

  // Get recent reviews for user
  async getRecentReviews(userId: string, limit: number = 10): Promise<ReviewWithDetails[]> {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (limit < 1 || limit > 50) {
      throw new ValidationError('Limit must be between 1 and 50');
    }

    return this.reviewRepository.getRecentReviews(userId, limit);
  }

  // Check if user can review loan
  async canReviewLoan(
    loanId: string,
    reviewerId: string
  ): Promise<{
    canReview: boolean;
    reason?: string;
    reviewType?: ReviewType;
  }> {
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
    const reviewType: ReviewType =
      loan.borrower_id === reviewerId ? 'borrower_to_lender' : 'lender_to_borrower';

    // Check if review already exists
    const existingReview = await this.reviewRepository.existsForLoanAndReviewer(
      loanId,
      reviewerId,
      reviewType
    );

    if (existingReview) {
      return { canReview: false, reason: 'You have already reviewed this loan' };
    }

    return { canReview: true, reviewType };
  }

  // Validate review data
  private validateReviewData(data: CreateReviewData): void {
    this.validateRating(data.rating);

    if (data.comment) {
      this.validateComment(data.comment);
    }

    if (!['borrower_to_lender', 'lender_to_borrower'].includes(data.type)) {
      throw new ValidationError('Invalid review type');
    }
  }

  // Validate rating
  private validateRating(rating: number): void {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be an integer between 1 and 5');
    }
  }

  // Validate comment
  private validateComment(comment: string): void {
    if (comment.trim().length === 0) {
      throw new ValidationError('Comment cannot be empty');
    }

    if (comment.length > 1000) {
      throw new ValidationError('Comment cannot exceed 1000 characters');
    }

    // Basic profanity/inappropriate content check (simplified)
    const inappropriateWords = ['spam', 'scam']; // In real app, use a proper filter
    const lowerComment = comment.toLowerCase();

    for (const word of inappropriateWords) {
      if (lowerComment.includes(word)) {
        throw new ValidationError('Comment contains inappropriate content');
      }
    }
  }
}
