import { apiService } from './api/ApiService';
import { MOCK_CATEGORIES, MOCK_ITEMS, MOCK_USERS, mockDelay } from './mockData';

import type { Item, ItemWithDetails, PaginatedResponse, Location } from '@/types';

// const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const USE_MOCK = false;

interface GetItemsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  location?: Location;
  maxDistance?: number;
  priceRange?: [number, number];
  period?: 'hora' | 'dia' | 'semana' | 'mes' | null;
  onlyAvailable?: boolean;
  onlyVerified?: boolean;
  minRating?: number;
}

export const itemsService = {
  async getItems({
    page,
    limit,
    search = '',
    category,
    location,
    maxDistance = 0,
    priceRange,
    period,
    onlyAvailable,
    onlyVerified,
    minRating,
  }: GetItemsParams): Promise<PaginatedResponse<ItemWithDetails>> {
    if (USE_MOCK) {
      console.log('📦 Buscando itens com parâmetros:', {
        page,
        limit,
        search,
        category,
        location,
        maxDistance,
        priceRange,
        period,
        onlyAvailable,
        onlyVerified,
        minRating,
      });
      console.log('📊 Total de itens mock:', MOCK_ITEMS.length);

      await mockDelay(500);
      let filteredItems = [...MOCK_ITEMS];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredItems = filteredItems.filter(
          (item) =>
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower)
        );
      }

      if (category) {
        filteredItems = filteredItems.filter((item) => item.categoryId === category);
      }

      if (location && maxDistance > 0) {
        filteredItems = filteredItems.filter((item) => {
          if (!item.location) return false;

          const distance = this.calculateDistance(
            location.latitude,
            location.longitude,
            item.location.latitude,
            item.location.longitude
          );

          return distance <= maxDistance;
        });
      }

      if (priceRange && (priceRange[0] > 0 || priceRange[1] < 1000)) {
        filteredItems = filteredItems.filter((item) => {
          const price = item.price || 0;
          return price >= priceRange[0] && price <= priceRange[1];
        });
      }

      if (period) {
        filteredItems = filteredItems.filter((item) => {
          return item.period === period;
        });
      }

      if (onlyAvailable) {
        filteredItems = filteredItems.filter((item) => item.status === 'available');
      }

      if (onlyVerified) {
        filteredItems = filteredItems.filter((item) => {
          const owner = MOCK_USERS.find((user) => user.id === item.ownerId);
          return owner && owner.rating && owner.rating >= 4.5;
        });
      }

      if (minRating && minRating > 0) {
        filteredItems = filteredItems.filter((item) => {
          const owner = MOCK_USERS.find((user) => user.id === item.ownerId);
          return owner && owner.rating && owner.rating >= minRating;
        });
      }

      filteredItems.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedItems = filteredItems.slice(start, end);

      const itemsWithDetails: ItemWithDetails[] = paginatedItems.map((item) => {
        let owner = MOCK_USERS.find((user) => user.id === item.ownerId);
        let category = MOCK_CATEGORIES.find((cat) => cat.id === item.categoryId);

        if (!owner) {
          console.warn('Proprietário não encontrado para o item', item.id, '- usando owner fake');
          owner = {
            id: 'fake',
            name: 'Desconhecido',
            email: 'fake@example.com',
            avatar: '',
            rating: 0,
            location: item.location,
            createdAt: '',
            updatedAt: '',
          };
        }

        if (!category) {
          console.warn('Categoria não encontrada para o item', item.id, '- usando categoria fake');
          category = {
            id: 'fake',
            name: 'Desconhecida',
            icon: 'help',
            color: '#ccc',
          };
        }

        return {
          ...item,
          owner,
          category,
          rating: owner.rating,
          distance: location
            ? this.calculateDistance(
                location.latitude,
                location.longitude,
                item.location.latitude,
                item.location.longitude
              )
            : undefined,
        };
      });

      console.log('✅ Retornando itens:', {
        itemsCount: itemsWithDetails.length,
        total: filteredItems.length,
        page,
        hasMore: end < filteredItems.length,
      });

      return {
        items: itemsWithDetails,
        total: filteredItems.length,
        page,
        limit,
        hasMore: end < filteredItems.length,
      };
    }

    return apiService.getPaginated<ItemWithDetails>('/items', {
      page,
      limit,
      search,
      category,
      location,
      maxDistance,
      priceRange,
      period,
      onlyAvailable,
      onlyVerified,
      minRating,
    });
  },

  async getItem(id: string): Promise<ItemWithDetails> {
    if (USE_MOCK) {
      await mockDelay(500);
      const item = MOCK_ITEMS.find((item) => item.id === id);
      if (!item) {
        throw new Error('Item não encontrado');
      }

      try {
        const owner = MOCK_USERS.find((user) => user.id === item.ownerId);
        const category = MOCK_CATEGORIES.find((cat) => cat.id === item.categoryId);

        if (!owner) {
          throw new Error('Proprietário não encontrado');
        }

        if (!category) {
          throw new Error('Categoria não encontrada');
        }

        return {
          ...item,
          owner,
          category,
        };
      } catch (error) {
        console.error('Erro ao converter item:', error);
        throw new Error('Erro ao carregar detalhes do item');
      }
    }

    return apiService.get<ItemWithDetails>(`/items/${id}`);
  },

  async createItem(data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    if (USE_MOCK) {
      await mockDelay(1000);

      // Simular criação de item
      const newItem: Item = {
        id: `item_${Date.now()}`,
        title: data.title,
        description: data.description,
        price: data.price,
        period: data.period,
        images: data.images,
        categoryId: data.categoryId,
        ownerId: data.ownerId,
        location: data.location,
        status: data.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Adicionar à lista de itens mock
      MOCK_ITEMS.push(newItem);

      return newItem;
    }
    return apiService.post<Item>('/items', data);
  },

  async updateItem(id: string, data: Partial<Item>): Promise<Item> {
    if (USE_MOCK) {
      throw new Error('Não é possível atualizar itens no modo mock');
    }
    return apiService.patch<Item>(`/items/${id}`, data);
  },

  async deleteItem(id: string): Promise<void> {
    if (USE_MOCK) {
      throw new Error('Não é possível deletar itens no modo mock');
    }
    await apiService.delete(`/items/${id}`);
  },

  async uploadItemImage(itemId: string, file: File): Promise<{ url: string }> {
    if (USE_MOCK) {
      throw new Error('Não é possível fazer upload de imagens no modo mock');
    }
    const formData = new FormData();
    formData.append('image', file);
    return apiService.post<{ url: string }>(`/items/${itemId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteItemImage(itemId: string, imageUrl: string): Promise<void> {
    if (USE_MOCK) {
      throw new Error('Não é possível deletar imagens no modo mock');
    }
    await apiService.delete(`/items/${itemId}/images`, {
      data: { imageUrl },
    });
  },

  async updateItemStatus(id: string, status: Item['status']): Promise<Item> {
    if (USE_MOCK) {
      throw new Error('Não é possível atualizar status no modo mock');
    }
    return apiService.patch<Item>(`/items/${id}/status`, { status });
  },

  async getMyItems(params?: {
    page?: number;
    limit?: number;
    status?: Item['status'];
  }): Promise<PaginatedResponse<Item>> {
    if (USE_MOCK) {
      throw new Error('Não é possível buscar itens do usuário no modo mock');
    }
    return apiService.getPaginated<Item>('/items/me', params);
  },

  async getFavoriteItems(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Item>> {
    if (USE_MOCK) {
      throw new Error('Não é possível buscar itens favoritos no modo mock');
    }
    return apiService.getPaginated<Item>('/items/favorites', params);
  },

  async toggleFavorite(itemId: string): Promise<void> {
    if (USE_MOCK) {
      throw new Error('Não é possível favoritar itens no modo mock');
    }
    await apiService.post(`/items/${itemId}/favorite`);
  },

  // Função auxiliar para calcular distância entre dois pontos
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Função auxiliar para converter graus em radianos
  toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  },
};
