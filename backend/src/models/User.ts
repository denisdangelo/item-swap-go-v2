export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  avatar_url?: string;
}

export interface UserProfile extends Omit<User, 'password_hash'> {
  full_name: string;
  items_count: number;
  reviews_count: number;
  average_rating: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}
