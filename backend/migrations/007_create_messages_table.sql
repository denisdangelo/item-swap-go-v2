-- UP
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  recipient_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36),
  loan_id VARCHAR(36),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL,
  CONSTRAINT fk_messages_loan FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE SET NULL,
  
  INDEX idx_messages_sender (sender_id),
  INDEX idx_messages_recipient (recipient_id),
  INDEX idx_messages_item (item_id),
  INDEX idx_messages_loan (loan_id),
  INDEX idx_messages_read (is_read),
  INDEX idx_messages_created (created_at),
  INDEX idx_messages_conversation (sender_id, recipient_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOWN section removed for container init scripts