// Tipos para os serviços da API
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface CreateItemData {
  title: string;
  description: string;
  price: number;
  period: 'hora' | 'dia' | 'semana' | 'mes';
  categoryId: string;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface UpdateItemData {
  title?: string;
  description?: string;
  price?: number;
  period?: 'hora' | 'dia' | 'semana' | 'mes';
  categoryId?: string;
  images?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface ItemSearchFilters {
  search?: string;
  category?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  maxDistance?: number;
  priceRange?: [number, number];
  period?: 'hora' | 'dia' | 'semana' | 'mes';
  onlyAvailable?: boolean;
  onlyVerified?: boolean;
  minRating?: number;
}

export interface CategoryWithItemCount {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
}
