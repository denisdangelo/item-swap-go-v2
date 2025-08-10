import { Request, Response } from 'express';
export declare class ReviewController {
    private reviewService;
    constructor();
    createReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getReviewById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserReviews: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getReviewsByReviewer: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getReviewsByLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserRatingStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getRecentReviews: (req: Request, res: Response, next: import("express").NextFunction) => void;
    canReviewLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const createReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getReviewById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteReview: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserReviews: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getReviewsByReviewer: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getReviewsByLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserRatingStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getRecentReviews: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const canReviewLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
