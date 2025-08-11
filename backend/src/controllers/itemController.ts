import { asyncHandler } from '@/middleware/errorHandler';
import { ItemService } from '@/services/ItemService';
import { sendCreated, sendPaginatedSuccess, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

// Simplified: no Zod. Accept raw bodies and queries.

export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  // Create new item
  createItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId || (req.body && (req.body.owner_id || req.body.ownerId));

    if (!userId) {
      throw new Error('User ID is required (provide via Authorization header or owner_id in body)');
    }

    const item = await this.itemService.createItem(req.body as any, userId);

    sendCreated(res, item, 'Item created successfully');
  });

  // Get item by ID
  getItemById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const item = await this.itemService.getItemById(id);

    sendSuccess(res, item, 'Item retrieved successfully');
  });

  // Update item
  updateItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const item = await this.itemService.updateItem(id, req.body as any, userId);

    sendSuccess(res, item, 'Item updated successfully');
  });

  // Delete item
  deleteItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.itemService.deleteItem(id, userId);

    sendSuccess(res, null, 'Item deleted successfully');
  });

  // Search items
  searchItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const filters: any = {
      ...req.query,
      page,
      limit,
      min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
      condition_rating: req.query.condition_rating
        ? parseInt(req.query.condition_rating as string)
        : undefined,
      location_lat: req.query.location_lat
        ? parseFloat(req.query.location_lat as string)
        : undefined,
      location_lng: req.query.location_lng
        ? parseFloat(req.query.location_lng as string)
        : undefined,
      radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
      is_available: req.query.is_available ? req.query.is_available === 'true' : undefined,
    };

    // Get user location for distance calculation if available
    const userLat = req.user ? undefined : undefined; // Could be extracted from user profile
    const userLng = req.user ? undefined : undefined;

    const result = await this.itemService.searchItems(filters, { page, limit }, userLat, userLng);

    sendPaginatedSuccess(res, result.data, result.pagination, 'Items retrieved successfully');
  });

  // Get items by owner
  getItemsByOwner = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const ownerId = req.params.ownerId || req.user?.userId;

    if (!ownerId) {
      throw new Error('Owner ID is required');
    }

    const items = await this.itemService.getItemsByOwner(ownerId);

    sendSuccess(res, items, 'Items retrieved successfully');
  });

  // Get my items (items owned by the logged-in user)
  getMyItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const items = await this.itemService.getMyItems(userId);

    sendSuccess(res, items, 'My items retrieved successfully');
  });

  // Get items by category
  getItemsByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;

    const items = await this.itemService.getItemsByCategory(categoryId);

    sendSuccess(res, items, 'Category items retrieved successfully');
  });

  // Get nearby items
  getNearbyItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : 10;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Valid latitude and longitude are required');
    }

    const items = await this.itemService.getNearbyItems(lat, lng, radius, limit);

    sendSuccess(res, items, 'Nearby items retrieved successfully');
  });

  // Set item availability
  setItemAvailability = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { is_available } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    if (typeof is_available !== 'boolean') {
      throw new Error('is_available must be a boolean');
    }

    const item = await this.itemService.setItemAvailability(id, is_available, userId);

    sendSuccess(res, item, 'Item availability updated successfully');
  });

  // Add item image
  addItemImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const image = await this.itemService.addItemImage(
      id,
      req.body.url,
      req.body.alt_text,
      req.body.is_primary,
      userId
    );

    sendCreated(res, image, 'Image added successfully');
  });

  // Remove item image
  removeItemImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { imageId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.itemService.removeItemImage(imageId, userId);

    sendSuccess(res, null, 'Image removed successfully');
  });

  // Get item images
  getItemImages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const images = await this.itemService.getItemImages(id);

    sendSuccess(res, images, 'Item images retrieved successfully');
  });
}

// Create controller instance
const itemController = new ItemController();

// Export controller methods
export const createItem = itemController.createItem;
export const getItemById = itemController.getItemById;
export const updateItem = itemController.updateItem;
export const deleteItem = itemController.deleteItem;
export const searchItems = itemController.searchItems;
export const getItemsByOwner = itemController.getItemsByOwner;
export const getMyItems = itemController.getMyItems;
export const getItemsByCategory = itemController.getItemsByCategory;
export const getNearbyItems = itemController.getNearbyItems;
export const setItemAvailability = itemController.setItemAvailability;
export const addItemImage = itemController.addItemImage;
export const removeItemImage = itemController.removeItemImage;
export const getItemImages = itemController.getItemImages;
