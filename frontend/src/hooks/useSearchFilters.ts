import { useState, useEffect, useMemo } from 'react';
import type { Location } from '@/types';

export interface SearchFilters {
  searchQuery: string;
  selectedCategory: string | null;
  maxDistance: number;
  priceRange: [number, number];
  period: 'hora' | 'dia' | 'semana' | 'mes' | null;
  onlyAvailable: boolean;
  onlyVerified: boolean;
  minRating: number;
  userLocation: Location | null;
}

export interface UseSearchFiltersReturn {
  filters: SearchFilters;
  debouncedSearch: string;
  activeFilterCount: number;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
}

const defaultFilters: SearchFilters = {
  searchQuery: '',
  selectedCategory: null,
  maxDistance: 0,
  priceRange: [0, 1000],
  period: null,
  onlyAvailable: false,
  onlyVerified: false,
  minRating: 0,
  userLocation: null,
};

export function useSearchFilters(): UseSearchFiltersReturn {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return [
      !!debouncedSearch,
      !!filters.selectedCategory,
      filters.maxDistance > 0,
      filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
      !!filters.period,
      filters.onlyAvailable,
      filters.onlyVerified,
      filters.minRating > 0,
    ].filter(Boolean).length;
  }, [
    debouncedSearch,
    filters.selectedCategory,
    filters.maxDistance,
    filters.priceRange,
    filters.period,
    filters.onlyAvailable,
    filters.onlyVerified,
    filters.minRating,
  ]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const setSearchQuery = (query: string) => {
    updateFilter('searchQuery', query);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    debouncedSearch,
    activeFilterCount,
    updateFilter,
    resetFilters,
    setSearchQuery,
  };
}
