import { apiService } from './api';
import { MOCK_CATEGORIES, mockDelay } from './mockData';

import type { Category, PaginatedResponse } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const categoriesService = {
  async getCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Category>> {
    if (USE_MOCK) {
      await mockDelay(500);
      return {
        items: MOCK_CATEGORIES,
        total: MOCK_CATEGORIES.length,
        page: params?.page || 1,
        limit: params?.limit || MOCK_CATEGORIES.length,
        hasMore: false,
      };
    }
    return apiService.getPaginated<Category>('/categories', params);
  },

  async getCategory(id: string): Promise<Category> {
    if (USE_MOCK) {
      await mockDelay(300);
      const category = MOCK_CATEGORIES.find((c) => c.id === id);
      if (!category) {
        throw new Error('Categoria não encontrada');
      }
      return category;
    }
    return apiService.get<Category>(`/categories/${id}`);
  },

  async createCategory(data: Omit<Category, 'id'>): Promise<Category> {
    if (USE_MOCK) {
      throw new Error('Não é possível criar categorias no modo mock');
    }
    return apiService.post<Category>('/categories', data);
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    if (USE_MOCK) {
      throw new Error('Não é possível atualizar categorias no modo mock');
    }
    return apiService.patch<Category>(`/categories/${id}`, data);
  },

  async deleteCategory(id: string): Promise<void> {
    if (USE_MOCK) {
      throw new Error('Não é possível deletar categorias no modo mock');
    }
    await apiService.delete(`/categories/${id}`);
  },
};
