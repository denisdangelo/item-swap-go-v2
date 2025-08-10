// Export all API services
export { ApiService, apiService } from './ApiService';
export { AuthApiService, authApiService } from './AuthApiService';
export { CategoriesApiService, categoriesApiService } from './CategoriesApiService';
export { ItemsApiService, itemsApiService } from './ItemsApiService';
export { UsersApiService, usersApiService } from './UsersApiService';

// Export types
export type { ApiError, ApiResponse } from './ApiService';
export type {
  SimpleAuthResponse,
  ChangePasswordData,
  LoginData,
  RegisterData,
  User,
  UserProfile,
} from './AuthApiService';
export type {
  Category,
  CategoryStats,
  CategoryWithItemCount,
  CreateCategoryData,
  UpdateCategoryData,
} from './CategoriesApiService';
export type {
  CreateItemData,
  Item,
  ItemImage,
  ItemSearchFilters,
  ItemSearchResult,
  ItemWithDetails,
  UpdateItemData,
} from './ItemsApiService';
export type { UpdateUserData, UserLocation, UserSearchOptions, UserStats } from './UsersApiService';
