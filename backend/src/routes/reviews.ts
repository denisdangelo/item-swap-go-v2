import {
  canReviewLoan,
  createReview,
  deleteReview,
  getRecentReviews,
  getReviewById,
  getReviewsByLoan,
  getReviewsByReviewer,
  getUserRatingStats,
  getUserReviews,
  updateReview,
} from '@/controllers/reviewController';
import { authenticate, optionalAuthenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// Public routes
router.get('/user/:userId', getUserReviews);
router.get('/user/:userId/stats', getUserRatingStats);
router.get('/user/:userId/recent', getRecentReviews);

// Protected routes
router.post('/', authenticate, createReview);
router.get('/:id', optionalAuthenticate, getReviewById);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

// User-specific routes
router.get('/reviewer/me', authenticate, getReviewsByReviewer);

// Loan-specific routes
router.get('/loan/:loanId', getReviewsByLoan);
router.get('/loan/:loanId/can-review', authenticate, canReviewLoan);

export default router;
