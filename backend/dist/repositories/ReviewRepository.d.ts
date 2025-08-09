import { CreateReviewData, Review, ReviewType, ReviewWithDetails, UpdateReviewData } from '@/models/Review';
import { BaseRepository } from './BaseRepository';
export declare class ReviewRepository extends BaseRepository<Review, CreateReviewData, UpdateReviewData> {
    protected tableName: string;
    protected selectFields: string;
    create(data: CreateReviewData, reviewerId: string): Promise<Review>;
    findWithDetails(id: string): Promise<ReviewWithDetails | null>;
    findByReviewer(reviewerId: string): Promise<Review[]>;
    findByReviewed(reviewedId: string): Promise<Review[]>;
    findByLoan(loanId: string): Promise<Review[]>;
    findByType(type: ReviewType): Promise<Review[]>;
    findUserReviewsWithDetails(userId: string): Promise<ReviewWithDetails[]>;
    existsForLoanAndReviewer(loanId: string, reviewerId: string, type: ReviewType): Promise<boolean>;
    getUserRatingStats(userId: string): Promise<{
        average_rating: number;
        total_reviews: number;
        rating_distribution: {
            [key: number]: number;
        };
    }>;
    getRecentReviews(userId: string, limit?: number): Promise<ReviewWithDetails[]>;
}
