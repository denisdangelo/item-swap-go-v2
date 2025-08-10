import { executeQuery } from '@/config/database';
import { CreateLoanData, Loan, LoanStatus, LoanWithDetails, UpdateLoanData } from '@/models/Loan';
import { BaseRepository } from './BaseRepository';

export class LoanRepository extends BaseRepository<Loan, CreateLoanData, UpdateLoanData> {
  protected tableName = 'loans';
  protected selectFields = `
    id, item_id, borrower_id, lender_id, start_date, end_date,
    daily_rate, total_amount, status, notes, created_at, updated_at
  `;

  // Create loan with calculated total amount
  async create(data: CreateLoanData, borrowerId: string, dailyRate: number): Promise<Loan> {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = durationDays * dailyRate;

    // Get lender_id from item
    const itemQuery = 'SELECT owner_id FROM items WHERE id = ?';
    const itemResult = await executeQuery<Array<{ owner_id: string }>>(itemQuery, [data.item_id]);

    if (itemResult.length === 0) {
      throw new Error('Item not found');
    }

    const loanData = {
      ...data,
      borrower_id: borrowerId,
      lender_id: itemResult[0].owner_id,
      daily_rate: dailyRate,
      total_amount: totalAmount,
    };

    return super.create(loanData as any);
  }

  // Get loan with full details
  async findWithDetails(id: string): Promise<LoanWithDetails | null> {
    const query = `
      SELECT 
        l.id, l.item_id, l.borrower_id, l.lender_id, l.start_date, l.end_date,
        l.daily_rate, l.total_amount, l.status, l.notes, l.created_at, l.updated_at,
        
        i.title as item_title,
        
        b.first_name as borrower_first_name, b.last_name as borrower_last_name,
        b.avatar_url as borrower_avatar_url,
        
        le.first_name as lender_first_name, le.last_name as lender_last_name,
        le.avatar_url as lender_avatar_url,
        
        DATEDIFF(l.end_date, l.start_date) as duration_days
      FROM loans l
      JOIN items i ON l.item_id = i.id
      JOIN users b ON l.borrower_id = b.id
      JOIN users le ON l.lender_id = le.id
      WHERE l.id = ?
    `;

    const rows = await executeQuery<any[]>(query, [id]);
    if (rows.length === 0) return null;

    const row = rows[0];

    // Get item images
    const imagesQuery = `
      SELECT url, is_primary
      FROM item_images
      WHERE item_id = ?
      ORDER BY is_primary DESC, sort_order ASC
    `;
    const images = await executeQuery<Array<{ url: string; is_primary: boolean }>>(imagesQuery, [
      row.item_id,
    ]);

    return {
      id: row.id,
      item_id: row.item_id,
      borrower_id: row.borrower_id,
      lender_id: row.lender_id,
      start_date: row.start_date,
      end_date: row.end_date,
      daily_rate: row.daily_rate,
      total_amount: row.total_amount,
      status: row.status,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      item: {
        id: row.item_id,
        title: row.item_title,
        images,
      },
      borrower: {
        id: row.borrower_id,
        first_name: row.borrower_first_name,
        last_name: row.borrower_last_name,
        avatar_url: row.borrower_avatar_url,
      },
      lender: {
        id: row.lender_id,
        first_name: row.lender_first_name,
        last_name: row.lender_last_name,
        avatar_url: row.lender_avatar_url,
      },
      duration_days: row.duration_days,
    };
  }

  // Find loans by borrower
  async findByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.findAll({ borrower_id: borrowerId });
  }

  // Find loans by lender
  async findByLender(lenderId: string): Promise<Loan[]> {
    return this.findAll({ lender_id: lenderId });
  }

  // Find loans by item
  async findByItem(itemId: string): Promise<Loan[]> {
    return this.findAll({ item_id: itemId });
  }

  // Find loans by status
  async findByStatus(status: LoanStatus): Promise<Loan[]> {
    return this.findAll({ status });
  }

  // Find user loans (as borrower or lender)
  async findUserLoans(userId: string): Promise<LoanWithDetails[]> {
    const query = `
      SELECT 
        l.id, l.item_id, l.borrower_id, l.lender_id, l.start_date, l.end_date,
        l.daily_rate, l.total_amount, l.status, l.notes, l.created_at, l.updated_at,
        
        i.title as item_title,
        
        b.first_name as borrower_first_name, b.last_name as borrower_last_name,
        b.avatar_url as borrower_avatar_url,
        
        le.first_name as lender_first_name, le.last_name as lender_last_name,
        le.avatar_url as lender_avatar_url,
        
        DATEDIFF(l.end_date, l.start_date) as duration_days
      FROM loans l
      JOIN items i ON l.item_id = i.id
      JOIN users b ON l.borrower_id = b.id
      JOIN users le ON l.lender_id = le.id
      WHERE l.borrower_id = ? OR l.lender_id = ?
      ORDER BY l.created_at DESC
    `;

    const rows = await executeQuery<any[]>(query, [userId, userId]);

    const loans: LoanWithDetails[] = [];
    for (const row of rows) {
      // Get item images
      const imagesQuery = `
        SELECT url, is_primary
        FROM item_images
        WHERE item_id = ?
        ORDER BY is_primary DESC, sort_order ASC
      `;
      const images = await executeQuery<Array<{ url: string; is_primary: boolean }>>(imagesQuery, [
        row.item_id,
      ]);

      loans.push({
        id: row.id,
        item_id: row.item_id,
        borrower_id: row.borrower_id,
        lender_id: row.lender_id,
        start_date: row.start_date,
        end_date: row.end_date,
        daily_rate: row.daily_rate,
        total_amount: row.total_amount,
        status: row.status,
        notes: row.notes,
        created_at: row.created_at,
        updated_at: row.updated_at,
        item: {
          id: row.item_id,
          title: row.item_title,
          images,
        },
        borrower: {
          id: row.borrower_id,
          first_name: row.borrower_first_name,
          last_name: row.borrower_last_name,
          avatar_url: row.borrower_avatar_url,
        },
        lender: {
          id: row.lender_id,
          first_name: row.lender_first_name,
          last_name: row.lender_last_name,
          avatar_url: row.lender_avatar_url,
        },
        duration_days: row.duration_days,
      });
    }

    return loans;
  }

  // Check if item has conflicting loans
  async hasConflictingLoans(
    itemId: string,
    startDate: Date,
    endDate: Date,
    excludeLoanId?: string
  ): Promise<boolean> {
    let query = `
      SELECT 1 FROM loans
      WHERE item_id = ? 
        AND status IN ('approved', 'active')
        AND (
          (start_date <= ? AND end_date >= ?) OR
          (start_date <= ? AND end_date >= ?) OR
          (start_date >= ? AND end_date <= ?)
        )
    `;

    const params = [itemId, startDate, startDate, endDate, endDate, startDate, endDate];

    if (excludeLoanId) {
      query += ' AND id != ?';
      params.push(excludeLoanId);
    }

    query += ' LIMIT 1';

    const rows = await executeQuery<any[]>(query, params);
    return rows.length > 0;
  }

  // Get loan statistics for user
  async getUserLoanStats(userId: string): Promise<{
    as_borrower: { total: number; active: number; completed: number };
    as_lender: { total: number; active: number; completed: number };
  }> {
    const query = `
      SELECT 
        COUNT(CASE WHEN borrower_id = ? THEN 1 END) as borrower_total,
        COUNT(CASE WHEN borrower_id = ? AND status IN ('approved', 'active') THEN 1 END) as borrower_active,
        COUNT(CASE WHEN borrower_id = ? AND status = 'completed' THEN 1 END) as borrower_completed,
        COUNT(CASE WHEN lender_id = ? THEN 1 END) as lender_total,
        COUNT(CASE WHEN lender_id = ? AND status IN ('approved', 'active') THEN 1 END) as lender_active,
        COUNT(CASE WHEN lender_id = ? AND status = 'completed' THEN 1 END) as lender_completed
      FROM loans
      WHERE borrower_id = ? OR lender_id = ?
    `;

    const rows = await executeQuery<any[]>(query, [
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
    ]);
    const row = rows[0] || {};

    return {
      as_borrower: {
        total: row.borrower_total || 0,
        active: row.borrower_active || 0,
        completed: row.borrower_completed || 0,
      },
      as_lender: {
        total: row.lender_total || 0,
        active: row.lender_active || 0,
        completed: row.lender_completed || 0,
      },
    };
  }
}
