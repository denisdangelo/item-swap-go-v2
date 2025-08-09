"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeLoan = exports.cancelLoan = exports.getUserLoanStats = exports.getItemLoans = exports.getLoansAsLender = exports.getLoansAsBorrower = exports.getUserLoans = exports.updateLoanStatus = exports.getLoanById = exports.createLoan = exports.LoanController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const LoanService_1 = require("@/services/LoanService");
const response_1 = require("@/utils/response");
const zod_1 = require("zod");
// Validation schemas
const createLoanSchema = zod_1.z.object({
    item_id: zod_1.z.string().min(1, 'Item ID is required'),
    start_date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date'),
    end_date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date'),
    notes: zod_1.z.string().max(500, 'Notes too long').optional(),
});
const updateLoanStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'approved', 'active', 'completed', 'cancelled']),
    notes: zod_1.z.string().max(500, 'Notes too long').optional(),
});
class LoanController {
    constructor() {
        // Create new loan request
        this.createLoan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const validatedData = createLoanSchema.parse(req.body);
            const loan = await this.loanService.createLoan(validatedData, userId);
            (0, response_1.sendCreated)(res, loan, 'Loan request created successfully');
        });
        // Get loan by ID
        this.getLoanById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const loan = await this.loanService.getLoanById(id);
            (0, response_1.sendSuccess)(res, loan, 'Loan retrieved successfully');
        });
        // Update loan status
        this.updateLoanStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const { status, notes } = updateLoanStatusSchema.parse(req.body);
            const loan = await this.loanService.updateLoanStatus(id, status, userId, notes);
            (0, response_1.sendSuccess)(res, loan, 'Loan status updated successfully');
        });
        // Get user loans
        this.getUserLoans = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const loans = await this.loanService.getUserLoans(userId);
            (0, response_1.sendSuccess)(res, loans, 'User loans retrieved successfully');
        });
        // Get loans as borrower
        this.getLoansAsBorrower = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const loans = await this.loanService.getLoansAsBorrower(userId);
            (0, response_1.sendSuccess)(res, loans, 'Borrower loans retrieved successfully');
        });
        // Get loans as lender
        this.getLoansAsLender = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const loans = await this.loanService.getLoansAsLender(userId);
            (0, response_1.sendSuccess)(res, loans, 'Lender loans retrieved successfully');
        });
        // Get item loans
        this.getItemLoans = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { itemId } = req.params;
            const loans = await this.loanService.getItemLoans(itemId);
            (0, response_1.sendSuccess)(res, loans, 'Item loans retrieved successfully');
        });
        // Get user loan statistics
        this.getUserLoanStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.userId || req.user?.userId;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const stats = await this.loanService.getUserLoanStats(userId);
            (0, response_1.sendSuccess)(res, stats, 'User loan statistics retrieved successfully');
        });
        // Cancel loan
        this.cancelLoan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            const { reason } = req.body;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const loan = await this.loanService.cancelLoan(id, userId, reason);
            (0, response_1.sendSuccess)(res, loan, 'Loan cancelled successfully');
        });
        // Complete loan
        this.completeLoan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const loan = await this.loanService.completeLoan(id, userId);
            (0, response_1.sendSuccess)(res, loan, 'Loan completed successfully');
        });
        this.loanService = new LoanService_1.LoanService();
    }
}
exports.LoanController = LoanController;
// Create controller instance
const loanController = new LoanController();
// Export controller methods
exports.createLoan = loanController.createLoan;
exports.getLoanById = loanController.getLoanById;
exports.updateLoanStatus = loanController.updateLoanStatus;
exports.getUserLoans = loanController.getUserLoans;
exports.getLoansAsBorrower = loanController.getLoansAsBorrower;
exports.getLoansAsLender = loanController.getLoansAsLender;
exports.getItemLoans = loanController.getItemLoans;
exports.getUserLoanStats = loanController.getUserLoanStats;
exports.cancelLoan = loanController.cancelLoan;
exports.completeLoan = loanController.completeLoan;
