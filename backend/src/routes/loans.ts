import {
  cancelLoan,
  completeLoan,
  createLoan,
  getItemLoans,
  getLoanById,
  getLoansAsBorrower,
  getLoansAsLender,
  getUserLoans,
  getUserLoanStats,
  updateLoanStatus,
} from '@/controllers/loanController';
import { authenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// All loan routes require authentication
router.use(authenticate);

// Loan CRUD operations
router.post('/', createLoan);
router.get('/:id', getLoanById);
router.patch('/:id/status', updateLoanStatus);

// User loan operations
router.get('/user/all', getUserLoans);
router.get('/user/as-borrower', getLoansAsBorrower);
router.get('/user/as-lender', getLoansAsLender);
router.get('/user/:userId/stats', getUserLoanStats);

// Item loans
router.get('/item/:itemId', getItemLoans);

// Loan actions
router.patch('/:id/cancel', cancelLoan);
router.patch('/:id/complete', completeLoan);

export default router;
