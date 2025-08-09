import { apiService } from './api/ApiService';
import type { Category, PaginatedResponse } from '@/types';

export const categoriesService = {
  async getCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Category>> {
    return apiService.getPaginated<Category>('/categories', params);
  },

  async getCategory(id: string): Promise<Category> {
    return apiService.get<Category>(`/categories/${id}`);
  },

  async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    return apiService.post<Category>('/categories', data);
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return apiService.patch<Category>(`/categories/${id}`, data);
  },

  async deleteCategory(id: string): Promise<void> {
    await apiService.delete(`/categories/${id}`);
  },
};
