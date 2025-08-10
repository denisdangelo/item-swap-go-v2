import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ItemRepository } from '@/repositories/ItemRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { AuthService } from '@/services/AuthService';
import { v4 as uuidv4 } from 'uuid';

// Test data factories
export const createTestUser = async (overrides: any = {}) => {
  const userRepo = new UserRepository();
  const userData = {
    email: `test-${uuidv4()}@example.com`,
    password: 'TestPassword123!',
    first_name: 'Test',
    last_name: 'User',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80',
    ...overrides,
  };

  return userRepo.create(userData);
};

export const createTestCategory = async (overrides: any = {}) => {
  const categoryRepo = new CategoryRepository();
  const categoryData = {
    name: `Test Category ${uuidv4()}`,
    description: 'Test category description',
    icon: 'test-icon',
    color: '#FF0000',
    ...overrides,
  };

  return categoryRepo.create(categoryData);
};

export const createTestItem = async (ownerId: string, categoryId: string, overrides: any = {}) => {
  const itemRepo = new ItemRepository();
  const itemData = {
    category_id: categoryId,
    title: `Test Item ${uuidv4()}`,
    description: 'Test item description',
    condition_rating: 4,
    estimated_value: 100.0,
    daily_rate: 10.0,
    ...overrides,
  };

  return itemRepo.create(itemData, ownerId);
};

export const createAuthenticatedUser = async (overrides: any = {}) => {
  const authService = new AuthService();
  const userData = {
    email: `test-${uuidv4()}@example.com`,
    password: 'TestPassword123!',
    first_name: 'Test',
    last_name: 'User',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80',
    ...overrides,
  };

  const result = await authService.register(userData);
  return {
    user: result.user,
    tokens: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  };
};

// Database cleanup helpers
export const cleanupDatabase = async () => {
  // Clean up test data in reverse dependency order
  const queries = [
    'DELETE FROM refresh_tokens WHERE user_id LIKE "test-%"',
    'DELETE FROM messages WHERE sender_id LIKE "test-%" OR recipient_id LIKE "test-%"',
    'DELETE FROM reviews WHERE reviewer_id LIKE "test-%" OR reviewed_id LIKE "test-%"',
    'DELETE FROM loans WHERE borrower_id LIKE "test-%" OR lender_id LIKE "test-%"',
    'DELETE FROM item_images WHERE item_id IN (SELECT id FROM items WHERE owner_id LIKE "test-%")',
    'DELETE FROM items WHERE owner_id LIKE "test-%"',
    'DELETE FROM categories WHERE name LIKE "Test Category%"',
    'DELETE FROM users WHERE email LIKE "test-%@example.com"',
  ];

  // Execute cleanup queries
  // Note: In a real implementation, you'd use the database connection here
  // For now, this is a placeholder
};

// Mock request/response helpers
export const mockRequest = (overrides: any = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: undefined,
  ...overrides,
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();

// JWT token helpers
export const generateTestToken = (payload: any = {}) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    {
      userId: uuidv4(),
      email: 'test@example.com',
      ...payload,
    },
    'test-secret',
    { expiresIn: '1h' }
  );
};
