import { asyncHandler } from '@/middleware/errorHandler';
import { LoanService } from '@/services/LoanService';
import { sendCreated, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schemas
const createLoanSchema = z.object({
  item_id: z.string().min(1, 'Item ID is required'),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date'),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

const updateLoanStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'active', 'completed', 'cancelled']),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export class LoanController {
  private loanService: LoanService;

  constructor() {
    this.loanService = new LoanService();
  }

  // Create new loan request
  createLoan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const validatedData = createLoanSchema.parse(req.body);

    const loan = await this.loanService.createLoan(validatedData, userId);

    sendCreated(res, loan, 'Loan request created successfully');
  });

  // Get loan by ID
  getLoanById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const loan = await this.loanService.getLoanById(id);

    sendSuccess(res, loan, 'Loan retrieved successfully');
  });

  // Update loan status
  updateLoanStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const { status, notes } = updateLoanStatusSchema.parse(req.body);

    const loan = await this.loanService.updateLoanStatus(id, status, userId, notes);

    sendSuccess(res, loan, 'Loan status updated successfully');
  });

  // Get user loans
  getUserLoans = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const loans = await this.loanService.getUserLoans(userId);

    sendSuccess(res, loans, 'User loans retrieved successfully');
  });

  // Get loans as borrower
  getLoansAsBorrower = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const loans = await this.loanService.getLoansAsBorrower(userId);

    sendSuccess(res, loans, 'Borrower loans retrieved successfully');
  });

  // Get loans as lender
  getLoansAsLender = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const loans = await this.loanService.getLoansAsLender(userId);

    sendSuccess(res, loans, 'Lender loans retrieved successfully');
  });

  // Get item loans
  getItemLoans = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.params;

    const loans = await this.loanService.getItemLoans(itemId);

    sendSuccess(res, loans, 'Item loans retrieved successfully');
  });

  // Get user loan statistics
  getUserLoanStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId || req.user?.userId;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const stats = await this.loanService.getUserLoanStats(userId);

    sendSuccess(res, stats, 'User loan statistics retrieved successfully');
  });

  // Cancel loan
  cancelLoan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { reason } = req.body;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const loan = await this.loanService.cancelLoan(id, userId, reason);

    sendSuccess(res, loan, 'Loan cancelled successfully');
  });

  // Complete loan
  completeLoan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const loan = await this.loanService.completeLoan(id, userId);

    sendSuccess(res, loan, 'Loan completed successfully');
  });
}

// Create controller instance
const loanController = new LoanController();

// Export controller methods
export const createLoan = loanController.createLoan;
export const getLoanById = loanController.getLoanById;
export const updateLoanStatus = loanController.updateLoanStatus;
export const getUserLoans = loanController.getUserLoans;
export const getLoansAsBorrower = loanController.getLoansAsBorrower;
export const getLoansAsLender = loanController.getLoansAsLender;
export const getItemLoans = loanController.getItemLoans;
export const getUserLoanStats = loanController.getUserLoanStats;
export const cancelLoan = loanController.cancelLoan;
export const completeLoan = loanController.completeLoan;
