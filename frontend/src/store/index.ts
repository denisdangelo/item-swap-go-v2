import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type Category, categoriesApiService, itemsApiService } from '@/services/api/index';
import { geolocationService } from '@/services/geolocation';

import type { ItemWithDetails, Location, Screen } from '@/types';

export interface AppState {
  // Navigation
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedItem: ItemWithDetails | null;
  setSelectedItem: (item: ItemWithDetails | null) => void;

  // Location
  userLocation: Location | null;
  setUserLocation: (location: Location | null) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  initializeLocation: () => Promise<void>;

  // UI
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Categories (with API integration)
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  loadCategories: () => Promise<void>;
  refreshCategories: () => Promise<void>;

  // Items (with API integration)
  items: ItemWithDetails[];
  setItems: (items: ItemWithDetails[]) => void;
  loadItems: (filters?: any) => Promise<void>;
  searchItems: (query: string, filters?: any) => Promise<void>;
  loadNearbyItems: () => Promise<void>;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Reset
  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentScreen: 'onboarding',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      selectedItem: null,
      setSelectedItem: (item) => set({ selectedItem: item }),

      // Location
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),
      maxDistance: 10, // Default 10km
      setMaxDistance: (distance) => set({ maxDistance: distance }),
      initializeLocation: async () => {
        try {
          set({ isLoading: true });
          const location = await geolocationService.getCurrentLocation();
          set({ userLocation: location, isLoading: false });

          // Load nearby items after getting location
          get().loadNearbyItems();
        } catch (error) {
          console.error('Error getting location:', error);
          set({
            error: 'Failed to get your location. Please enable location services.',
            isLoading: false,
          });
        }
      },

      // UI
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Categories (with API integration)
      categories: [],
      setCategories: (categories) => set({ categories }),

      loadCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const categories = await categoriesApiService.getActiveCategories();
          set({ categories: categories as Category[], isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
          set({ error: errorMessage, isLoading: false });
        }
      },

      refreshCategories: async () => {
        try {
          categoriesApiService.clearCache();
          await get().loadCategories();
        } catch (error) {
          console.error('Error refreshing categories:', error);
        }
      },

      // Items (with API integration)
      items: [],
      setItems: (items) => set({ items }),

      loadItems: async (filters = {}) => {
        try {
          set({ isLoading: true, error: null });
          const result = await itemsApiService.getItems({
            page: 1,
            limit: 20,
            ...filters,
          });
          set({ items: result.items, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load items';
          set({ error: errorMessage, isLoading: false });
        }
      },

      searchItems: async (query: string, filters = {}) => {
        try {
          set({ isLoading: true, error: null });
          const result = await itemsApiService.getItems({
            search: query,
            page: 1,
            limit: 20,
            ...filters,
          });
          set({ items: result.items, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to search items';
          set({ error: errorMessage, isLoading: false });
        }
      },

      loadNearbyItems: async () => {
        const { userLocation, maxDistance } = get();

        if (!userLocation) {
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const result = await itemsApiService.getItems({
            page: 1,
            limit: 20,
            location: userLocation,
            maxDistance,
          });
          set({ items: result.items, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to load nearby items';
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Reset
      reset: () =>
        set({
          currentScreen: 'onboarding',
          selectedItem: null,
          userLocation: null,
          maxDistance: 10,
          isLoading: false,
          error: null,
          categories: [],
          items: [],
        }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        currentScreen: state.currentScreen,
        userLocation: state.userLocation,
        maxDistance: state.maxDistance,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// Função auxiliar para verificar se estamos no ambiente do navegador
const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

// Inicializa o store
if (isBrowser()) {
  // Load initial data
  const store = useStore.getState();
  store.loadCategories().catch(console.error);

  // Load items if we have location
  if (store.userLocation) {
    store.loadNearbyItems().catch(console.error);
  } else {
    store.loadItems().catch(console.error);
  }
}

// Inicializa o tema escuro se necessário
if (isBrowser()) {
  const root = document.documentElement;
  const isDarkMode = useStore.getState().isDarkMode;
  if (isDarkMode && root) {
    root.classList.add('dark');
  }
}

// Monitora mudanças no tema
useStore.subscribe((state) => {
  if (isBrowser()) {
    const root = document.documentElement;
    if (root) {
      if (state.isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
});

// Exportar o tipo do store para garantir que o TypeScript infira corretamente
export type Store = ReturnType<typeof useStore>;
