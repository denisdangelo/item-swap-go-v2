import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/middleware/errorHandler';
import { CreateLoanData, Loan, LoanStatus, LoanWithDetails, UpdateLoanData } from '@/models/Loan';
import { ItemRepository } from '@/repositories/ItemRepository';
import { LoanRepository } from '@/repositories/LoanRepository';
import { UserRepository } from '@/repositories/UserRepository';

export class LoanService {
  private loanRepository: LoanRepository;
  private itemRepository: ItemRepository;
  private userRepository: UserRepository;

  constructor() {
    this.loanRepository = new LoanRepository();
    this.itemRepository = new ItemRepository();
    this.userRepository = new UserRepository();
  }

  // Create new loan request
  async createLoan(loanData: CreateLoanData, borrowerId: string): Promise<LoanWithDetails> {
    // Validate loan data
    this.validateLoanData(loanData);

    // Check if item exists and is available
    const item = await this.itemRepository.findById(loanData.item_id);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (!item.is_available || !item.is_active) {
      throw new ConflictError('Item is not available for loan');
    }

    // Check if borrower is not the owner
    if (item.owner_id === borrowerId) {
      throw new ConflictError('You cannot borrow your own item');
    }

    // Check if borrower exists
    const borrower = await this.userRepository.findById(borrowerId);
    if (!borrower) {
      throw new NotFoundError('Borrower not found');
    }

    // Check for conflicting loans
    const hasConflict = await this.loanRepository.hasConflictingLoans(
      loanData.item_id,
      new Date(loanData.start_date),
      new Date(loanData.end_date)
    );

    if (hasConflict) {
      throw new ConflictError('Item is already booked for the selected dates');
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
  async getLoanById(id: string): Promise<LoanWithDetails> {
    const loan = await this.loanRepository.findWithDetails(id);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }
    return loan;
  }

  // Update loan status
  async updateLoanStatus(
    id: string,
    status: LoanStatus,
    userId: string,
    notes?: string
  ): Promise<LoanWithDetails> {
    // Get loan
    const existingLoan = await this.loanRepository.findById(id);
    if (!existingLoan) {
      throw new NotFoundError('Loan not found');
    }

    // Check authorization (only lender can approve/reject, both can cancel/complete)
    const canUpdate = this.canUpdateLoanStatus(existingLoan, status, userId);
    if (!canUpdate) {
      throw new AuthorizationError('You are not authorized to update this loan status');
    }

    // Validate status transition
    this.validateStatusTransition(existingLoan.status, status);

    // Update loan
    const updateData: UpdateLoanData = { status };
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
  async getUserLoans(userId: string): Promise<LoanWithDetails[]> {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.loanRepository.findUserLoans(userId);
  }

  // Get loans as borrower
  async getLoansAsBorrower(borrowerId: string): Promise<Loan[]> {
    return this.loanRepository.findByBorrower(borrowerId);
  }

  // Get loans as lender
  async getLoansAsLender(lenderId: string): Promise<Loan[]> {
    return this.loanRepository.findByLender(lenderId);
  }

  // Get loans by status
  async getLoansByStatus(status: LoanStatus): Promise<Loan[]> {
    return this.loanRepository.findByStatus(status);
  }

  // Get item loans
  async getItemLoans(itemId: string): Promise<Loan[]> {
    // Check if item exists
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    return this.loanRepository.findByItem(itemId);
  }

  // Get user loan statistics
  async getUserLoanStats(userId: string): Promise<{
    as_borrower: { total: number; active: number; completed: number };
    as_lender: { total: number; active: number; completed: number };
  }> {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.loanRepository.getUserLoanStats(userId);
  }

  // Cancel loan
  async cancelLoan(id: string, userId: string, reason?: string): Promise<LoanWithDetails> {
    return this.updateLoanStatus(id, 'cancelled', userId, reason);
  }

  // Complete loan
  async completeLoan(id: string, userId: string): Promise<LoanWithDetails> {
    return this.updateLoanStatus(id, 'completed', userId);
  }

  // Validate loan data
  private validateLoanData(data: CreateLoanData): void {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const now = new Date();

    if (startDate < now) {
      throw new ValidationError('Start date cannot be in the past');
    }

    if (endDate <= startDate) {
      throw new ValidationError('End date must be after start date');
    }

    const maxLoanDays = 30; // Maximum loan period
    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (durationDays > maxLoanDays) {
      throw new ValidationError(`Loan period cannot exceed ${maxLoanDays} days`);
    }

    if (durationDays < 1) {
      throw new ValidationError('Loan period must be at least 1 day');
    }
  }

  // Check if user can update loan status
  private canUpdateLoanStatus(loan: Loan, newStatus: LoanStatus, userId: string): boolean {
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
        return (
          (loan.borrower_id === userId || loan.lender_id === userId) && loan.status === 'active'
        );

      default:
        return false;
    }
  }

  // Validate status transition
  private validateStatusTransition(currentStatus: LoanStatus, newStatus: LoanStatus): void {
    const validTransitions: Record<LoanStatus, LoanStatus[]> = {
      pending: ['approved', 'cancelled'],
      approved: ['active', 'cancelled'],
      active: ['completed', 'cancelled'],
      completed: [], // Final state
      cancelled: [], // Final state
    };

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new ValidationError(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }
  }
}
