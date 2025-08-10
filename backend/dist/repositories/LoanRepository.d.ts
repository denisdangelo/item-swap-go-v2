import { CreateLoanData, Loan, LoanStatus, LoanWithDetails, UpdateLoanData } from '@/models/Loan';
import { BaseRepository } from './BaseRepository';
export declare class LoanRepository extends BaseRepository<Loan, CreateLoanData, UpdateLoanData> {
    protected tableName: string;
    protected selectFields: string;
    create(data: CreateLoanData, borrowerId: string, dailyRate: number): Promise<Loan>;
    findWithDetails(id: string): Promise<LoanWithDetails | null>;
    findByBorrower(borrowerId: string): Promise<Loan[]>;
    findByLender(lenderId: string): Promise<Loan[]>;
    findByItem(itemId: string): Promise<Loan[]>;
    findByStatus(status: LoanStatus): Promise<Loan[]>;
    findUserLoans(userId: string): Promise<LoanWithDetails[]>;
    hasConflictingLoans(itemId: string, startDate: Date, endDate: Date, excludeLoanId?: string): Promise<boolean>;
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
}
