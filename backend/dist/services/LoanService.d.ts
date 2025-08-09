import { CreateLoanData, Loan, LoanStatus, LoanWithDetails } from '@/models/Loan';
export declare class LoanService {
    private loanRepository;
    private itemRepository;
    private userRepository;
    constructor();
    createLoan(loanData: CreateLoanData, borrowerId: string): Promise<LoanWithDetails>;
    getLoanById(id: string): Promise<LoanWithDetails>;
    updateLoanStatus(id: string, status: LoanStatus, userId: string, notes?: string): Promise<LoanWithDetails>;
    getUserLoans(userId: string): Promise<LoanWithDetails[]>;
    getLoansAsBorrower(borrowerId: string): Promise<Loan[]>;
    getLoansAsLender(lenderId: string): Promise<Loan[]>;
    getLoansByStatus(status: LoanStatus): Promise<Loan[]>;
    getItemLoans(itemId: string): Promise<Loan[]>;
    getUserLoanStats(userId: string): Promise<{
        as_borrower: {
            total: number;
            active: number;
            completed: number;
        };
        as_lender: {
            total: number;
            active: number;
            completed: number;
        };
    }>;
    cancelLoan(id: string, userId: string, reason?: string): Promise<LoanWithDetails>;
    completeLoan(id: string, userId: string): Promise<LoanWithDetails>;
    private validateLoanData;
    private canUpdateLoanStatus;
    private validateStatusTransition;
}
