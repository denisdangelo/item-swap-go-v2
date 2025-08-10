export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  rating?: number;
  location?: Location;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithDetails extends User {
  rating: number;
  location: Location;
  verified: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  period?: 'hora' | 'dia' | 'semana' | 'mes';
  images: string[];
  categoryId: string;
  ownerId: string;
  location: Location;
  status: 'available' | 'unavailable' | 'rented';
  createdAt: string;
  updatedAt: string;
}

// Interface para criação de item
export interface CreateItemData {
  title: string;
  description: string;
  price: string;
  period: 'hora' | 'dia' | 'semana' | 'mes';
  categoryId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  specifications?: ItemSpecification[];
}

// Interface para dados do formulário de adição de item
export interface AddItemData {
  title: string;
  description: string;
  price: string;
  period: 'hora' | 'dia' | 'semana' | 'mes';
  categoryId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  specifications?: ItemSpecification[];
}

// Interface para especificações do item
export interface ItemSpecification {
  label: string;
  value: string;
}

interface Specification {
  label: string;
  value: string;
}

// Interface para dados de item com informações adicionais do usuário
export interface ItemWithDetails extends Item {
  owner?: User;
  category?: Category;
  featured?: boolean;
  rating?: number;
  specifications?: Specification[];
  distance?: number;
}

// Interface para dados de item com informações de localização formatadas
export interface ItemWithLocation extends Item {
  formattedLocation?: {
    city: string;
    state: string;
    address: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  participants: string[];
  itemId: string;
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'chat' | 'item' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type Screen = 'onboarding' | 'feed' | 'details' | 'chat' | 'profile' | 'login';
