-- UP
CREATE TABLE items (
  id VARCHAR(36) PRIMARY KEY,
  owner_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  condition_rating TINYINT NOT NULL CHECK (condition_rating BETWEEN 1 AND 5),
  estimated_value DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  
  INDEX idx_items_owner (owner_id),
  INDEX idx_items_category (category_id),
  INDEX idx_items_location (location_lat, location_lng),
  INDEX idx_items_available (is_available),
  INDEX idx_items_active (is_active),
  INDEX idx_items_created (created_at),
  FULLTEXT idx_items_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DOWN
DROP TABLE IF EXISTS items;