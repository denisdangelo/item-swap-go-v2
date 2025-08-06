import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface SearchFilters {
  searchQuery: string;
  selectedCategory: string | null;
  maxDistance: number;
  priceRange: [number, number];
  period: 'hora' | 'dia' | 'semana' | 'mes' | null;
  onlyAvailable: boolean;
  onlyVerified: boolean;
  minRating: number;
}

interface SearchFiltersContextType {
  filters: SearchFilters;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setMaxDistance: (distance: number) => void;
  setPriceRange: (range: [number, number]) => void;
  setPeriod: (period: 'hora' | 'dia' | 'semana' | 'mes' | null) => void;
  setOnlyAvailable: (available: boolean) => void;
  setOnlyVerified: (verified: boolean) => void;
  setMinRating: (rating: number) => void;
  clearFilters: () => void;
  activeFilterCount: number;
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
};

const SearchFiltersContext = createContext<SearchFiltersContextType | undefined>(undefined);

export const useSearchFilters = () => {
  const context = useContext(SearchFiltersContext);
  if (!context) {
    throw new Error('useSearchFilters must be used within a SearchFiltersProvider');
  }
  return context;
};

interface SearchFiltersProviderProps {
  children: ReactNode;
}

export const SearchFiltersProvider: React.FC<SearchFiltersProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // Debug log
  React.useEffect(() => {
    console.log('🔍 Filtros atuais:', filters);
    console.log('🔢 Filtros ativos:', activeFilterCount);
  }, [filters]);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSelectedCategory = useCallback((category: string | null) => {
    setFilters((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const setMaxDistance = useCallback((distance: number) => {
    setFilters((prev) => ({ ...prev, maxDistance: distance }));
  }, []);

  const setPriceRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  }, []);

  const setPeriod = useCallback((period: 'hora' | 'dia' | 'semana' | 'mes' | null) => {
    setFilters((prev) => ({ ...prev, period }));
  }, []);

  const setOnlyAvailable = useCallback((available: boolean) => {
    setFilters((prev) => ({ ...prev, onlyAvailable: available }));
  }, []);

  const setOnlyVerified = useCallback((verified: boolean) => {
    setFilters((prev) => ({ ...prev, onlyVerified: verified }));
  }, []);

  const setMinRating = useCallback((rating: number) => {
    setFilters((prev) => ({ ...prev, minRating: rating }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Calcular filtros ativos
  const activeFilterCount = React.useMemo(() => {
    return [
      !!filters.searchQuery,
      !!filters.selectedCategory,
      filters.maxDistance > 0,
      filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
      !!filters.period,
      filters.onlyAvailable,
      filters.onlyVerified,
      filters.minRating > 0,
    ].filter(Boolean).length;
  }, [filters]);

  const value: SearchFiltersContextType = {
    filters,
    setSearchQuery,
    setSelectedCategory,
    setMaxDistance,
    setPriceRange,
    setPeriod,
    setOnlyAvailable,
    setOnlyVerified,
    setMinRating,
    clearFilters,
    activeFilterCount,
  };

  return <SearchFiltersContext.Provider value={value}>{children}</SearchFiltersContext.Provider>;
};
