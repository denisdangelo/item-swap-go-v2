export type LoanStatus = 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
export interface Loan {
    id: string;
    item_id: string;
    borrower_id: string;
    lender_id: string;
    start_date: Date;
    end_date: Date;
    daily_rate: number;
    total_amount: number;
    status: LoanStatus;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateLoanData {
    item_id: string;
    start_date: Date;
    end_date: Date;
    notes?: string;
}
export interface UpdateLoanData {
    status?: LoanStatus;
    notes?: string;
}
export interface LoanWithDetails extends Loan {
    item: {
        id: string;
        title: string;
        images: Array<{
            url: string;
            is_primary: boolean;
        }>;
    };
    borrower: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
    lender: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
    duration_days: number;
}
