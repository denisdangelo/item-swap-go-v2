import { apiService } from './ApiService';

export interface ItemImage {
  id: string;
  item_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Item {
  id: string;
  owner_id: string;
  category_id: string;
  title: string;
  description: string;
  condition_rating: number;
  estimated_value?: number;
  daily_rate?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemWithDetails extends Item {
  owner: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    average_rating: number;
    reviews_count: number;
  };
  category: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  images: ItemImage[];
  distance?: number;
}

export interface CreateItemData {
  category_id: string;
  title: string;
  description: string;
  condition_rating: number;
  estimated_value?: number;
  daily_rate?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}

export interface UpdateItemData {
  category_id?: string;
  title?: string;
  description?: string;
  condition_rating?: number;
  estimated_value?: number;
  daily_rate?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  is_available?: boolean;
}

export interface ItemSearchFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  condition_rating?: number;
  location_lat?: number;
  location_lng?: number;
  radius?: number;
  search?: string;
  is_available?: boolean;
  page?: number;
  limit?: number;
}

export interface ItemSearchResult {
  data: ItemWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetItemsResult {
  items: ItemWithDetails[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export class ItemsApiService {
  // Back-compat wrapper used by the app store
  async getItems(filters: ItemSearchFilters & { page?: number; limit?: number } = {}): Promise<GetItemsResult> {
    console.debug('[ItemsApiService] getItems() -> filters', filters);
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const result = await this.searchItems({ ...filters, page, limit });
    const total = result.pagination.total ?? result.data.length;
    const totalPages = result.pagination.totalPages ?? Math.ceil(total / limit);
    return {
      items: result.data,
      total,
      page,
      limit,
      hasMore: page < totalPages,
    };
  }

  // Get all items with search and filters
  async searchItems(filters: ItemSearchFilters = {}): Promise<ItemSearchResult> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiService.get<ItemWithDetails[]>('/items/search', { params });

    if (response.success && response.data) {
      return {
        data: response.data,
        pagination: response.pagination || {
          page: Number(params.get('page')) || 1,
          limit: Number(params.get('limit')) || 20,
          total: response.data.length,
          totalPages: 1,
        },
      };
    }

    throw new Error('Failed to search items');
  }

  // Get item by ID
  async getItemById(id: string): Promise<ItemWithDetails> {
    const response = await apiService.get<ItemWithDetails>(`/items/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get item');
  }

  // Create new item
  async createItem(data: CreateItemData): Promise<ItemWithDetails> {
    const response = await apiService.post<ItemWithDetails>('/items', data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to create item');
  }

  // Update item
  async updateItem(id: string, data: UpdateItemData): Promise<ItemWithDetails> {
    const response = await apiService.put<ItemWithDetails>(`/items/${id}`, data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to update item');
  }

  // Delete item
  async deleteItem(id: string): Promise<void> {
    const response = await apiService.delete(`/items/${id}`);

    if (!response.success) {
      throw new Error('Failed to delete item');
    }
  }

  // Get items by owner
  async getItemsByOwner(ownerId?: string): Promise<Item[]> {
    const url = ownerId ? `/items/owner/${ownerId}` : '/items/owner/me';
    const response = await apiService.get<Item[]>(url);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get owner items');
  }

  // Get items by category
  async getItemsByCategory(categoryId: string): Promise<Item[]> {
    const response = await apiService.get<Item[]>(`/items/category/${categoryId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get category items');
  }

  // Get nearby items
  async getNearbyItems(
    lat: number,
    lng: number,
    radius: number = 10,
    limit: number = 20
  ): Promise<ItemWithDetails[]> {
    const params = { lat, lng, radius, limit };
    const response = await apiService.get<ItemWithDetails[]>('/items/nearby', { params });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get nearby items');
  }

  // Set item availability
  async setItemAvailability(id: string, isAvailable: boolean): Promise<ItemWithDetails> {
    const response = await apiService.patch<ItemWithDetails>(`/items/${id}/availability`, {
      is_available: isAvailable,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to update item availability');
  }

  // Upload item images
  async uploadItemImages(
    itemId: string,
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<ItemImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiService.upload<ItemImage[]>(
      `/upload/item/${itemId}`,
      formData,
      onProgress
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to upload item images');
  }

  // Get item images
  async getItemImages(itemId: string): Promise<ItemImage[]> {
    const response = await apiService.get<ItemImage[]>(`/items/${itemId}/images`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get item images');
  }

  // Remove item image
  async removeItemImage(imageId: string): Promise<void> {
    const response = await apiService.delete(`/upload/${imageId}`);

    if (!response.success) {
      throw new Error('Failed to remove item image');
    }
  }

  // Get featured items (popular/recent)
  async getFeaturedItems(limit: number = 10): Promise<ItemWithDetails[]> {
    const response = await apiService.get<ItemWithDetails[]>('/items/search', {
      params: { limit, page: 1 },
    });

    if (response.success && response.data) {
      return response.data;
    }

    return [];
  }

  // Get recommended items (based on user preferences)
  async getRecommendedItems(limit: number = 10): Promise<ItemWithDetails[]> {
    // For now, return recent items. In a real app, this would use ML recommendations
    return this.getFeaturedItems(limit);
  }
}

// Export singleton instance
export const itemsApiService = new ItemsApiService();
