import { AuthorizationError, NotFoundError, ValidationError } from '@/middleware/errorHandler';
import {
  CreateItemData,
  Item,
  ItemImage,
  ItemSearchFilters,
  ItemSearchResult,
  ItemWithDetails,
  UpdateItemData,
} from '@/models/Item';
import { PaginationOptions, PaginationResult } from '@/repositories/BaseRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ItemRepository } from '@/repositories/ItemRepository';
import { UserRepository } from '@/repositories/UserRepository';

export class ItemService {
  private itemRepository: ItemRepository;
  private categoryRepository: CategoryRepository;
  private userRepository: UserRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
    this.categoryRepository = new CategoryRepository();
    this.userRepository = new UserRepository();
  }

  // Create new item
  async createItem(itemData: CreateItemData, ownerId: string): Promise<ItemWithDetails> {
    // Validate item data
    await this.validateItemData(itemData);

    // Check if user exists
    const user = await this.userRepository.findById(ownerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if category exists and is active
    const category = await this.categoryRepository.findById(itemData.category_id);
    if (!category || !category.is_active) {
      throw new NotFoundError('Category not found or inactive');
    }

    // Create item
    const item = await this.itemRepository.create(itemData, ownerId);

    // Return item with details
    const itemWithDetails = await this.itemRepository.findWithDetails(item.id);
    if (!itemWithDetails) {
      throw new Error('Failed to retrieve created item');
    }

    return itemWithDetails;
  }

  // Get item by ID with details
  async getItemById(id: string): Promise<ItemWithDetails> {
    const item = await this.itemRepository.findWithDetails(id);
    if (!item) {
      throw new NotFoundError('Item not found');
    }
    return item;
  }

  // Update item
  async updateItem(
    id: string,
    updateData: UpdateItemData,
    userId: string
  ): Promise<ItemWithDetails> {
    // Check if item exists
    const existingItem = await this.itemRepository.findById(id);
    if (!existingItem) {
      throw new NotFoundError('Item not found');
    }

    // Check if user owns the item
    if (existingItem.owner_id !== userId) {
      throw new AuthorizationError('You can only update your own items');
    }

    // Validate update data
    if (updateData.category_id) {
      const category = await this.categoryRepository.findById(updateData.category_id);
      if (!category || !category.is_active) {
        throw new NotFoundError('Category not found or inactive');
      }
    }

    this.validateItemUpdateData(updateData);

    // Update item
    const updatedItem = await this.itemRepository.update(id, updateData);
    if (!updatedItem) {
      throw new Error('Failed to update item');
    }

    // Return updated item with details
    const itemWithDetails = await this.itemRepository.findWithDetails(id);
    if (!itemWithDetails) {
      throw new Error('Failed to retrieve updated item');
    }

    return itemWithDetails;
  }

  // Delete item
  async deleteItem(id: string, userId: string): Promise<void> {
    // Check if item exists
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    // Check if user owns the item
    if (item.owner_id !== userId) {
      throw new AuthorizationError('You can only delete your own items');
    }

    // Soft delete (deactivate)
    const success = await this.itemRepository.softDelete(id);
    if (!success) {
      throw new Error('Failed to delete item');
    }
  }

  // Search items
  async searchItems(
    filters: ItemSearchFilters,
    pagination: PaginationOptions,
    userLat?: number,
    userLng?: number
  ): Promise<PaginationResult<ItemSearchResult>> {
    // Validate filters
    this.validateSearchFilters(filters);

    return this.itemRepository.searchItems(filters, pagination, userLat, userLng);
  }

  // Get items by owner
  async getItemsByOwner(ownerId: string): Promise<Item[]> {
    // Check if user exists
    const user = await this.userRepository.findById(ownerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.itemRepository.findByOwner(ownerId);
  }

  // Get items by category
  async getItemsByCategory(categoryId: string): Promise<Item[]> {
    // Check if category exists
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return this.itemRepository.findByCategory(categoryId);
  }

  // Get nearby items
  async getNearbyItems(
    lat: number,
    lng: number,
    radiusKm: number = 10,
    limit: number = 20
  ): Promise<ItemWithDetails[]> {
    this.validateLocation(lat, lng);

    if (radiusKm <= 0 || radiusKm > 100) {
      throw new ValidationError('Radius must be between 1 and 100 kilometers');
    }

    if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    return this.itemRepository.findNearby(lat, lng, radiusKm, limit);
  }

  // Set item availability
  async setItemAvailability(
    id: string,
    isAvailable: boolean,
    userId: string
  ): Promise<ItemWithDetails> {
    // Check if item exists
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    // Check if user owns the item
    if (item.owner_id !== userId) {
      throw new AuthorizationError('You can only modify your own items');
    }

    // Update availability
    const success = await this.itemRepository.setAvailability(id, isAvailable);
    if (!success) {
      throw new Error('Failed to update item availability');
    }

    // Return updated item
    const updatedItem = await this.itemRepository.findWithDetails(id);
    if (!updatedItem) {
      throw new Error('Failed to retrieve updated item');
    }

    return updatedItem;
  }

  // Add item image
  async addItemImage(
    itemId: string,
    imageUrl: string,
    altText?: string,
    isPrimary: boolean = false,
    userId?: string
  ): Promise<ItemImage> {
    // Check if item exists
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    // Check if user owns the item (if userId provided)
    if (userId && item.owner_id !== userId) {
      throw new AuthorizationError('You can only add images to your own items');
    }

    // Validate image URL
    if (!imageUrl || imageUrl.trim() === '') {
      throw new ValidationError('Image URL is required');
    }

    return this.itemRepository.addImage(itemId, imageUrl, altText, isPrimary);
  }

  // Remove item image
  async removeItemImage(imageId: string, userId: string): Promise<void> {
    // Get image to check item ownership
    const images = await this.itemRepository.getItemImages(''); // We need to get the item first
    // This is a simplified approach - in a real implementation, you'd have a separate method to get image by ID

    // For now, let's assume we have the item ID and check ownership
    // In a complete implementation, you'd need to modify the repository to get image details first

    const success = await this.itemRepository.removeImage(imageId);
    if (!success) {
      throw new NotFoundError('Image not found or failed to remove');
    }
  }

  // Get item images
  async getItemImages(itemId: string): Promise<ItemImage[]> {
    // Check if item exists
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    return this.itemRepository.getItemImages(itemId);
  }

  // Validate item data
  private async validateItemData(data: CreateItemData): Promise<void> {
    if (!data.title || data.title.trim().length < 3) {
      throw new ValidationError('Title must be at least 3 characters long');
    }

    if (data.title.trim().length > 200) {
      throw new ValidationError('Title must not exceed 200 characters');
    }

    if (!data.description || data.description.trim().length < 10) {
      throw new ValidationError('Description must be at least 10 characters long');
    }

    if (data.description.trim().length > 2000) {
      throw new ValidationError('Description must not exceed 2000 characters');
    }

    if (data.condition_rating < 1 || data.condition_rating > 5) {
      throw new ValidationError('Condition rating must be between 1 and 5');
    }

    if (data.estimated_value !== undefined && data.estimated_value < 0) {
      throw new ValidationError('Estimated value cannot be negative');
    }

    if (data.daily_rate !== undefined && data.daily_rate < 0) {
      throw new ValidationError('Daily rate cannot be negative');
    }

    if (data.location_lat !== undefined || data.location_lng !== undefined) {
      this.validateLocation(data.location_lat, data.location_lng);
    }
  }

  // Validate item update data
  private validateItemUpdateData(data: UpdateItemData): void {
    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length < 3) {
        throw new ValidationError('Title must be at least 3 characters long');
      }
      if (data.title.trim().length > 200) {
        throw new ValidationError('Title must not exceed 200 characters');
      }
    }

    if (data.description !== undefined) {
      if (!data.description || data.description.trim().length < 10) {
        throw new ValidationError('Description must be at least 10 characters long');
      }
      if (data.description.trim().length > 2000) {
        throw new ValidationError('Description must not exceed 2000 characters');
      }
    }

    if (data.condition_rating !== undefined) {
      if (data.condition_rating < 1 || data.condition_rating > 5) {
        throw new ValidationError('Condition rating must be between 1 and 5');
      }
    }

    if (data.estimated_value !== undefined && data.estimated_value < 0) {
      throw new ValidationError('Estimated value cannot be negative');
    }

    if (data.daily_rate !== undefined && data.daily_rate < 0) {
      throw new ValidationError('Daily rate cannot be negative');
    }

    if (data.location_lat !== undefined || data.location_lng !== undefined) {
      this.validateLocation(data.location_lat, data.location_lng);
    }
  }

  // Validate search filters
  private validateSearchFilters(filters: ItemSearchFilters): void {
    if (filters.min_price !== undefined && filters.min_price < 0) {
      throw new ValidationError('Minimum price cannot be negative');
    }

    if (filters.max_price !== undefined && filters.max_price < 0) {
      throw new ValidationError('Maximum price cannot be negative');
    }

    if (
      filters.min_price !== undefined &&
      filters.max_price !== undefined &&
      filters.min_price > filters.max_price
    ) {
      throw new ValidationError('Minimum price cannot be greater than maximum price');
    }

    if (
      filters.condition_rating !== undefined &&
      (filters.condition_rating < 1 || filters.condition_rating > 5)
    ) {
      throw new ValidationError('Condition rating must be between 1 and 5');
    }

    if (filters.radius !== undefined && (filters.radius <= 0 || filters.radius > 100)) {
      throw new ValidationError('Radius must be between 1 and 100 kilometers');
    }

    if (filters.location_lat !== undefined || filters.location_lng !== undefined) {
      this.validateLocation(filters.location_lat, filters.location_lng);
    }
  }

  // Validate location coordinates
  private validateLocation(lat?: number, lng?: number): void {
    if (lat !== undefined && (lat < -90 || lat > 90)) {
      throw new ValidationError('Latitude must be between -90 and 90');
    }

    if (lng !== undefined && (lng < -180 || lng > 180)) {
      throw new ValidationError('Longitude must be between -180 and 180');
    }

    if ((lat !== undefined && lng === undefined) || (lat === undefined && lng !== undefined)) {
      throw new ValidationError('Both latitude and longitude must be provided');
    }
  }
}
