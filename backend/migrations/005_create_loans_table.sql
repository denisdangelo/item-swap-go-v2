-- UP
CREATE TABLE IF NOT EXISTS loans (
  id VARCHAR(36) PRIMARY KEY,
  item_id VARCHAR(36) NOT NULL,
  borrower_id VARCHAR(36) NOT NULL,
  lender_id VARCHAR(36) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'approved', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_loans_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  CONSTRAINT fk_loans_borrower FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_loans_lender FOREIGN KEY (lender_id) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_loans_item (item_id),
  INDEX idx_loans_borrower (borrower_id),
  INDEX idx_loans_lender (lender_id),
  INDEX idx_loans_status (status),
  INDEX idx_loans_dates (start_date, end_date),
  INDEX idx_loans_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOWN section removed for container init scripts