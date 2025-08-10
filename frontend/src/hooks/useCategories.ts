import { type Category } from '@/services/api/index';
import { useStore } from '@/store';
import { useCallback, useEffect } from 'react';

export const useCategories = () => {
  const { categories, loadCategories, refreshCategories, isLoading, error, setError } = useStore();

  // Find category by name
  const findCategoryByName = useCallback(
    (name: string): Category | undefined => {
      return categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
    },
    [categories]
  );

  // Get category color
  const getCategoryColor = useCallback(
    (categoryId: string): string => {
      const category = categories.find((cat) => cat.id === categoryId);
      return category?.color || '#6B7280'; // Default gray
    },
    [categories]
  );

  // Get category icon
  const getCategoryIcon = useCallback(
    (categoryId: string): string => {
      const category = categories.find((cat) => cat.id === categoryId);
      return category?.icon || 'folder'; // Default folder icon
    },
    [categories]
  );

  // Load categories on mount if not already loaded
  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      loadCategories();
    }
  }, [categories.length, isLoading, loadCategories]);

  return {
    // State
    categories,
    isLoading,
    error,

    // Actions
    loadCategories,
    refreshCategories,

    // Utility functions
    findCategoryByName,
    getCategoryColor,
    getCategoryIcon,
    clearError: () => setError(null),

    // Computed values
    hasCategories: categories.length > 0,
    categoryCount: categories.length,
  };
};
