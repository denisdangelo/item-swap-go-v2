"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const ItemRepository_1 = require("@/repositories/ItemRepository");
const LoanRepository_1 = require("@/repositories/LoanRepository");
const UserRepository_1 = require("@/repositories/UserRepository");
class LoanService {
    constructor() {
        this.loanRepository = new LoanRepository_1.LoanRepository();
        this.itemRepository = new ItemRepository_1.ItemRepository();
        this.userRepository = new UserRepository_1.UserRepository();
    }
    // Create new loan request
    async createLoan(loanData, borrowerId) {
        // Validate loan data
        this.validateLoanData(loanData);
        // Check if item exists and is available
        const item = await this.itemRepository.findById(loanData.item_id);
        if (!item) {
            throw new errorHandler_1.NotFoundError('Item not found');
        }
        if (!item.is_available || !item.is_active) {
            throw new errorHandler_1.ConflictError('Item is not available for loan');
        }
        // Check if borrower is not the owner
        if (item.owner_id === borrowerId) {
            throw new errorHandler_1.ConflictError('You cannot borrow your own item');
        }
        // Check if borrower exists
        const borrower = await this.userRepository.findById(borrowerId);
        if (!borrower) {
            throw new errorHandler_1.NotFoundError('Borrower not found');
        }
        // Check for conflicting loans
        const hasConflict = await this.loanRepository.hasConflictingLoans(loanData.item_id, new Date(loanData.start_date), new Date(loanData.end_date));
        if (hasConflict) {
            throw new errorHandler_1.ConflictError('Item is already booked for the selected dates');
        }
        // Create loan
        const loan = await this.loanRepository.create(loanData, borrowerId, item.daily_rate || 0);
        // Return loan with details
        const loanWithDetails = await this.loanRepository.findWithDetails(loan.id);
        if (!loanWithDetails) {
            throw new Error('Failed to retrieve created loan');
        }
        return loanWithDetails;
    }
    // Get loan by ID
    async getLoanById(id) {
        const loan = await this.loanRepository.findWithDetails(id);
        if (!loan) {
            throw new errorHandler_1.NotFoundError('Loan not found');
        }
        return loan;
    }
    // Update loan status
    async updateLoanStatus(id, status, userId, notes) {
        // Get loan
        const existingLoan = await this.loanRepository.findById(id);
        if (!existingLoan) {
            throw new errorHandler_1.NotFoundError('Loan not found');
        }
        // Check authorization (only lender can approve/reject, both can cancel/complete)
        const canUpdate = this.canUpdateLoanStatus(existingLoan, status, userId);
        if (!canUpdate) {
            throw new errorHandler_1.AuthorizationError('You are not authorized to update this loan status');
        }
        // Validate status transition
        this.validateStatusTransition(existingLoan.status, status);
        // Update loan
        const updateData = { status };
        if (notes) {
            updateData.notes = notes;
        }
        await this.loanRepository.update(id, updateData);
        // If approved, mark item as unavailable for the loan period
        if (status === 'approved') {
            // Note: In a real implementation, you might want to implement a more sophisticated
            // availability system that tracks specific date ranges
        }
        // Return updated loan
        const updatedLoan = await this.loanRepository.findWithDetails(id);
        if (!updatedLoan) {
            throw new Error('Failed to retrieve updated loan');
        }
        return updatedLoan;
    }
    // Get user loans
    async getUserLoans(userId) {
        // Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        return this.loanRepository.findUserLoans(userId);
    }
    // Get loans as borrower
    async getLoansAsBorrower(borrowerId) {
        return this.loanRepository.findByBorrower(borrowerId);
    }
    // Get loans as lender
    async getLoansAsLender(lenderId) {
        return this.loanRepository.findByLender(lenderId);
    }
    // Get loans by status
    async getLoansByStatus(status) {
        return this.loanRepository.findByStatus(status);
    }
    // Get item loans
    async getItemLoans(itemId) {
        // Check if item exists
        const item = await this.itemRepository.findById(itemId);
        if (!item) {
            throw new errorHandler_1.NotFoundError('Item not found');
        }
        return this.loanRepository.findByItem(itemId);
    }
    // Get user loan statistics
    async getUserLoanStats(userId) {
        // Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new errorHandler_1.NotFoundError('User not found');
        }
        return this.loanRepository.getUserLoanStats(userId);
    }
    // Cancel loan
    async cancelLoan(id, userId, reason) {
        return this.updateLoanStatus(id, 'cancelled', userId, reason);
    }
    // Complete loan
    async completeLoan(id, userId) {
        return this.updateLoanStatus(id, 'completed', userId);
    }
    // Validate loan data
    validateLoanData(data) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        const now = new Date();
        if (startDate < now) {
            throw new errorHandler_1.ValidationError('Start date cannot be in the past');
        }
        if (endDate <= startDate) {
            throw new errorHandler_1.ValidationError('End date must be after start date');
        }
        const maxLoanDays = 30; // Maximum loan period
        const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (durationDays > maxLoanDays) {
            throw new errorHandler_1.ValidationError(`Loan period cannot exceed ${maxLoanDays} days`);
        }
        if (durationDays < 1) {
            throw new errorHandler_1.ValidationError('Loan period must be at least 1 day');
        }
    }
    // Check if user can update loan status
    canUpdateLoanStatus(loan, newStatus, userId) {
        switch (newStatus) {
            case 'approved':
            case 'cancelled':
                // Only lender can approve or cancel pending loans
                return loan.lender_id === userId && loan.status === 'pending';
            case 'active':
                // Only lender can mark as active (when item is picked up)
                return loan.lender_id === userId && loan.status === 'approved';
            case 'completed':
                // Both borrower and lender can mark as completed
                return ((loan.borrower_id === userId || loan.lender_id === userId) && loan.status === 'active');
            default:
                return false;
        }
    }
    // Validate status transition
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            pending: ['approved', 'cancelled'],
            approved: ['active', 'cancelled'],
            active: ['completed', 'cancelled'],
            completed: [], // Final state
            cancelled: [], // Final state
        };
        const allowedTransitions = validTransitions[currentStatus];
        if (!allowedTransitions.includes(newStatus)) {
            throw new errorHandler_1.ValidationError(`Cannot transition from ${currentStatus} to ${newStatus}`);
        }
    }
}
exports.LoanService = LoanService;
