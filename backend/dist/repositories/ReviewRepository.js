"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const database_1 = require("@/config/database");
const BaseRepository_1 = require("./BaseRepository");
class ReviewRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'reviews';
        this.selectFields = `
    id, loan_id, reviewer_id, reviewed_id, rating, comment, type, created_at, updated_at
  `;
    }
    // Create review with reviewer_id
    async create(data, reviewerId) {
        const reviewData = { ...data, reviewer_id: reviewerId };
        return super.create(reviewData);
    }
    // Get review with full details
    async findWithDetails(id) {
        const query = `
      SELECT 
        r.id, r.loan_id, r.reviewer_id, r.reviewed_id, r.rating, r.comment, r.type,
        r.created_at, r.updated_at,
        
        reviewer.first_name as reviewer_first_name, reviewer.last_name as reviewer_last_name,
        reviewer.avatar_url as reviewer_avatar_url,
        
        reviewed.first_name as reviewed_first_name, reviewed.last_name as reviewed_last_name,
        reviewed.avatar_url as reviewed_avatar_url,
        
        l.id as loan_id,
        i.id as item_id, i.title as item_title
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN users reviewed ON r.reviewed_id = reviewed.id
      JOIN loans l ON r.loan_id = l.id
      JOIN items i ON l.item_id = i.id
      WHERE r.id = ?
    `;
        const rows = await (0, database_1.executeQuery)(query, [id]);
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return {
            id: row.id,
            loan_id: row.loan_id,
            reviewer_id: row.reviewer_id,
            reviewed_id: row.reviewed_id,
            rating: row.rating,
            comment: row.comment,
            type: row.type,
            created_at: row.created_at,
            updated_at: row.updated_at,
            reviewer: {
                id: row.reviewer_id,
                first_name: row.reviewer_first_name,
                last_name: row.reviewer_last_name,
                avatar_url: row.reviewer_avatar_url,
            },
            reviewed: {
                id: row.reviewed_id,
                first_name: row.reviewed_first_name,
                last_name: row.reviewed_last_name,
                avatar_url: row.reviewed_avatar_url,
            },
            loan: {
                id: row.loan_id,
                item: {
                    id: row.item_id,
                    title: row.item_title,
                },
            },
        };
    }
    // Find reviews by reviewer
    async findByReviewer(reviewerId) {
        return this.findAll({ reviewer_id: reviewerId });
    }
    // Find reviews by reviewed user
    async findByReviewed(reviewedId) {
        return this.findAll({ reviewed_id: reviewedId });
    }
    // Find reviews by loan
    async findByLoan(loanId) {
        return this.findAll({ loan_id: loanId });
    }
    // Find reviews by type
    async findByType(type) {
        return this.findAll({ type });
    }
    // Get user reviews with details
    async findUserReviewsWithDetails(userId) {
        const query = `
      SELECT 
        r.id, r.loan_id, r.reviewer_id, r.reviewed_id, r.rating, r.comment, r.type,
        r.created_at, r.updated_at,
        
        reviewer.first_name as reviewer_first_name, reviewer.last_name as reviewer_last_name,
        reviewer.avatar_url as reviewer_avatar_url,
        
        reviewed.first_name as reviewed_first_name, reviewed.last_name as reviewed_last_name,
        reviewed.avatar_url as reviewed_avatar_url,
        
        l.id as loan_id,
        i.id as item_id, i.title as item_title
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN users reviewed ON r.reviewed_id = reviewed.id
      JOIN loans l ON r.loan_id = l.id
      JOIN items i ON l.item_id = i.id
      WHERE r.reviewed_id = ?
      ORDER BY r.created_at DESC
    `;
        const rows = await (0, database_1.executeQuery)(query, [userId]);
        return rows.map((row) => ({
            id: row.id,
            loan_id: row.loan_id,
            reviewer_id: row.reviewer_id,
            reviewed_id: row.reviewed_id,
            rating: row.rating,
            comment: row.comment,
            type: row.type,
            created_at: row.created_at,
            updated_at: row.updated_at,
            reviewer: {
                id: row.reviewer_id,
                first_name: row.reviewer_first_name,
                last_name: row.reviewer_last_name,
                avatar_url: row.reviewer_avatar_url,
            },
            reviewed: {
                id: row.reviewed_id,
                first_name: row.reviewed_first_name,
                last_name: row.reviewed_last_name,
                avatar_url: row.reviewed_avatar_url,
            },
            loan: {
                id: row.loan_id,
                item: {
                    id: row.item_id,
                    title: row.item_title,
                },
            },
        }));
    }
    // Check if review exists for loan and reviewer
    async existsForLoanAndReviewer(loanId, reviewerId, type) {
        const query = 'SELECT 1 FROM reviews WHERE loan_id = ? AND reviewer_id = ? AND type = ? LIMIT 1';
        const rows = await (0, database_1.executeQuery)(query, [loanId, reviewerId, type]);
        return rows.length > 0;
    }
    // Get user rating statistics
    async getUserRatingStats(userId) {
        const query = `
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5
      FROM reviews
      WHERE reviewed_id = ?
    `;
        const rows = await (0, database_1.executeQuery)(query, [userId]);
        const row = rows[0] || {};
        return {
            average_rating: parseFloat(row.average_rating) || 0,
            total_reviews: row.total_reviews || 0,
            rating_distribution: {
                1: row.rating_1 || 0,
                2: row.rating_2 || 0,
                3: row.rating_3 || 0,
                4: row.rating_4 || 0,
                5: row.rating_5 || 0,
            },
        };
    }
    // Get recent reviews for user
    async getRecentReviews(userId, limit = 10) {
        const query = `
      SELECT 
        r.id, r.loan_id, r.reviewer_id, r.reviewed_id, r.rating, r.comment, r.type,
        r.created_at, r.updated_at,
        
        reviewer.first_name as reviewer_first_name, reviewer.last_name as reviewer_last_name,
        reviewer.avatar_url as reviewer_avatar_url,
        
        reviewed.first_name as reviewed_first_name, reviewed.last_name as reviewed_last_name,
        reviewed.avatar_url as reviewed_avatar_url,
        
        l.id as loan_id,
        i.id as item_id, i.title as item_title
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN users reviewed ON r.reviewed_id = reviewed.id
      JOIN loans l ON r.loan_id = l.id
      JOIN items i ON l.item_id = i.id
      WHERE r.reviewed_id = ?
      ORDER BY r.created_at DESC
      LIMIT ?
    `;
        const rows = await (0, database_1.executeQuery)(query, [userId, limit]);
        return rows.map((row) => ({
            id: row.id,
            loan_id: row.loan_id,
            reviewer_id: row.reviewer_id,
            reviewed_id: row.reviewed_id,
            rating: row.rating,
            comment: row.comment,
            type: row.type,
            created_at: row.created_at,
            updated_at: row.updated_at,
            reviewer: {
                id: row.reviewer_id,
                first_name: row.reviewer_first_name,
                last_name: row.reviewer_last_name,
                avatar_url: row.reviewer_avatar_url,
            },
            reviewed: {
                id: row.reviewed_id,
                first_name: row.reviewed_first_name,
                last_name: row.reviewed_last_name,
                avatar_url: row.reviewed_avatar_url,
            },
            loan: {
                id: row.loan_id,
                item: {
                    id: row.item_id,
                    title: row.item_title,
                },
            },
        }));
    }
}
exports.ReviewRepository = ReviewRepository;
