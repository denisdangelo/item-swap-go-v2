import { CreateReviewData, Review, ReviewType, ReviewWithDetails, UpdateReviewData } from '@/models/Review';
export declare class ReviewService {
    private reviewRepository;
    private loanRepository;
    private userRepository;
    constructor();
    createReview(reviewData: CreateReviewData, reviewerId: string): Promise<ReviewWithDetails>;
    getReviewById(id: string): Promise<ReviewWithDetails>;
    updateReview(id: string, updateData: UpdateReviewData, userId: string): Promise<ReviewWithDetails>;
    deleteReview(id: string, userId: string): Promise<void>;
    getUserReviews(userId: string): Promise<ReviewWithDetails[]>;
    getReviewsByReviewer(reviewerId: string): Promise<Review[]>;
    getReviewsByLoan(loanId: string): Promise<Review[]>;
    getUserRatingStats(userId: string): Promise<{
        average_rating: number;
        total_reviews: number;
        rating_distribution: {
            [key: number]: number;
        };
    }>;
    getRecentReviews(userId: string, limit?: number): Promise<ReviewWithDetails[]>;
    canReviewLoan(loanId: string, reviewerId: string): Promise<{
        canReview: boolean;
        reason?: string;
        reviewType?: ReviewType;
    }>;
    private validateReviewData;
    private validateRating;
    private validateComment;
}
