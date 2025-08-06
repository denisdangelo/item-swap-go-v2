import { asyncHandler } from '@/middleware/errorHandler';
import { ItemService } from '@/services/ItemService';
import { sendCreated, sendPaginatedSuccess, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schemas
const createItemSchema = z.object({
  category_id: z.string().min(1, 'Category ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  condition_rating: z.number().int().min(1).max(5),
  estimated_value: z.number().min(0).optional(),
  daily_rate: z.number().min(0).optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  location_address: z.string().max(500, 'Address too long').optional(),
});

const updateItemSchema = z.object({
  category_id: z.string().min(1, 'Category ID is required').optional(),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title too long')
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long')
    .optional(),
  condition_rating: z.number().int().min(1).max(5).optional(),
  estimated_value: z.number().min(0).optional(),
  daily_rate: z.number().min(0).optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  location_address: z.string().max(500, 'Address too long').optional(),
  is_available: z.boolean().optional(),
});

const searchItemsSchema = z.object({
  category_id: z.string().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  condition_rating: z.number().int().min(1).max(5).optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  radius: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  is_available: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const addImageSchema = z.object({
  url: z.string().url('Invalid URL format'),
  alt_text: z.string().max(200, 'Alt text too long').optional(),
  is_primary: z.boolean().default(false),
});

export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  // Create new item
  createItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const validatedData = createItemSchema.parse(req.body);

    const item = await this.itemService.createItem(validatedData, userId);

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

    const validatedData = updateItemSchema.parse(req.body);

    const item = await this.itemService.updateItem(id, validatedData, userId);

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
    const validatedQuery = searchItemsSchema.parse({
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
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
    });

    const { page, limit, ...filters } = validatedQuery;

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

    sendSuccess(res, items, 'Owner items retrieved successfully');
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

    const validatedData = addImageSchema.parse(req.body);

    const image = await this.itemService.addItemImage(
      id,
      validatedData.url,
      validatedData.alt_text,
      validatedData.is_primary,
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
export const getItemsByCategory = itemController.getItemsByCategory;
export const getNearbyItems = itemController.getNearbyItems;
export const setItemAvailability = itemController.setItemAvailability;
export const addItemImage = itemController.addItemImage;
export const removeItemImage = itemController.removeItemImage;
export const getItemImages = itemController.getItemImages;
