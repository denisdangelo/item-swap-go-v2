import { useMemo } from 'react';
import type { Item } from '@/types';

export const useFeedFilters = (
  items: Item[],
  searchQuery: string,
  selectedCategory: string | null,
  userLocation: { latitude: number; longitude: number } | null,
  maxDistance: number
) => {
  return useMemo(() => {
    return items.filter(item => {
      // Filtro de busca
      const matchesSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro de categoria
      const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;

      // Filtro de distância
      const matchesDistance = !userLocation || !item.location || maxDistance === 0 ||
        calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.location.latitude,
          item.location.longitude
        ) <= maxDistance;

      return matchesSearch && matchesCategory && matchesDistance;
    });
  }, [items, searchQuery, selectedCategory, userLocation, maxDistance]);
};

// Função auxiliar para calcular distância entre dois pontos
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
