import {
  itemsApiService,
  type CreateItemData,
  type ItemSearchFilters,
  type UpdateItemData,
} from '@/services/api/index';
import { useStore } from '@/store';
import { useCallback } from 'react';

export const useItems = () => {
  const { items, setItems, loadItems, loadNearbyItems, isLoading, error, setLoading, setError } =
    useStore();

  // Create item
  const createItem = useCallback(
    async (data: CreateItemData) => {
      try {
        setLoading(true);
        setError(null);

        const newItem = await itemsApiService.createItem({
          ...data,
          ownerId: 'current-user-id', // This would come from auth
          status: 'available' as const,
        });

        // Refresh items list
        await loadItems();

        return { success: true, data: newItem };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, loadItems]
  );

  // Update item
  const updateItem = useCallback(
    async (id: string, data: UpdateItemData) => {
      try {
        setLoading(true);
        setError(null);

        const updatedItem = await itemsApiService.updateItem(id, data);

        // Refresh items list
        await loadItems();

        return { success: true, data: updatedItem };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, loadItems]
  );

  // Delete item
  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        await itemsApiService.deleteItem(id);

        // Refresh items list
        await loadItems();

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, loadItems]
  );

  // Get item by ID
  const getItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const item = await itemsApiService.getItem(id);
        return { success: true, data: item };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get item';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  // Search items with filters
  const searchItemsWithFilters = useCallback(
    async (filters: ItemSearchFilters) => {
      try {
        setLoading(true);
        setError(null);

        const result = await itemsApiService.getItems({
          page: 1,
          limit: 20,
          ...filters,
        });

        setItems(result.items);
        return { success: true, data: result };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search items';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setItems]
  );

  return {
    // State
    items,
    isLoading,
    error,

    // Actions
    loadItems,
    loadNearbyItems,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    searchItems: searchItemsWithFilters,

    // Utility functions
    clearError: () => setError(null),

    // Computed values
    hasItems: items.length > 0,
    itemCount: items.length,
  };
};
