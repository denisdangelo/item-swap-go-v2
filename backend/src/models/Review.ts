export type ReviewType = 'borrower_to_lender' | 'lender_to_borrower';

export interface Review {
  id: string;
  loan_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  type: ReviewType;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReviewData {
  loan_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  type: ReviewType;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ReviewWithDetails extends Review {
  reviewer: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  reviewed: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  loan: {
    id: string;
    item: {
      id: string;
      title: string;
    };
  };
}
