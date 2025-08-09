"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemImages = exports.removeItemImage = exports.addItemImage = exports.setItemAvailability = exports.getNearbyItems = exports.getItemsByCategory = exports.getItemsByOwner = exports.searchItems = exports.deleteItem = exports.updateItem = exports.getItemById = exports.createItem = exports.ItemController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const ItemService_1 = require("@/services/ItemService");
const response_1 = require("@/utils/response");
// Simplified: no Zod. Accept raw bodies and queries.
class ItemController {
    constructor() {
        // Create new item
        this.createItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const item = await this.itemService.createItem(req.body, userId);
            (0, response_1.sendCreated)(res, item, 'Item created successfully');
        });
        // Get item by ID
        this.getItemById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const item = await this.itemService.getItemById(id);
            (0, response_1.sendSuccess)(res, item, 'Item retrieved successfully');
        });
        // Update item
        this.updateItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const item = await this.itemService.updateItem(id, req.body, userId);
            (0, response_1.sendSuccess)(res, item, 'Item updated successfully');
        });
        // Delete item
        this.deleteItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.itemService.deleteItem(id, userId);
            (0, response_1.sendSuccess)(res, null, 'Item deleted successfully');
        });
        // Search items
        this.searchItems = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            const filters = {
                ...req.query,
                page,
                limit,
                min_price: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
                max_price: req.query.max_price ? parseFloat(req.query.max_price) : undefined,
                condition_rating: req.query.condition_rating
                    ? parseInt(req.query.condition_rating)
                    : undefined,
                location_lat: req.query.location_lat
                    ? parseFloat(req.query.location_lat)
                    : undefined,
                location_lng: req.query.location_lng
                    ? parseFloat(req.query.location_lng)
                    : undefined,
                radius: req.query.radius ? parseFloat(req.query.radius) : undefined,
                is_available: req.query.is_available ? req.query.is_available === 'true' : undefined,
            };
            // Get user location for distance calculation if available
            const userLat = req.user ? undefined : undefined; // Could be extracted from user profile
            const userLng = req.user ? undefined : undefined;
            const result = await this.itemService.searchItems(filters, { page, limit }, userLat, userLng);
            (0, response_1.sendPaginatedSuccess)(res, result.data, result.pagination, 'Items retrieved successfully');
        });
        // Get items by owner
        this.getItemsByOwner = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const ownerId = req.params.ownerId || req.user?.userId;
            if (!ownerId) {
                throw new Error('Owner ID is required');
            }
            const items = await this.itemService.getItemsByOwner(ownerId);
            (0, response_1.sendSuccess)(res, items, 'Owner items retrieved successfully');
        });
        // Get items by category
        this.getItemsByCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { categoryId } = req.params;
            const items = await this.itemService.getItemsByCategory(categoryId);
            (0, response_1.sendSuccess)(res, items, 'Category items retrieved successfully');
        });
        // Get nearby items
        this.getNearbyItems = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const lat = parseFloat(req.query.lat);
            const lng = parseFloat(req.query.lng);
            const radius = req.query.radius ? parseFloat(req.query.radius) : 10;
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            if (isNaN(lat) || isNaN(lng)) {
                throw new Error('Valid latitude and longitude are required');
            }
            const items = await this.itemService.getNearbyItems(lat, lng, radius, limit);
            (0, response_1.sendSuccess)(res, items, 'Nearby items retrieved successfully');
        });
        // Set item availability
        this.setItemAvailability = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
            (0, response_1.sendSuccess)(res, item, 'Item availability updated successfully');
        });
        // Add item image
        this.addItemImage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const image = await this.itemService.addItemImage(id, req.body.url, req.body.alt_text, req.body.is_primary, userId);
            (0, response_1.sendCreated)(res, image, 'Image added successfully');
        });
        // Remove item image
        this.removeItemImage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { imageId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.itemService.removeItemImage(imageId, userId);
            (0, response_1.sendSuccess)(res, null, 'Image removed successfully');
        });
        // Get item images
        this.getItemImages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const images = await this.itemService.getItemImages(id);
            (0, response_1.sendSuccess)(res, images, 'Item images retrieved successfully');
        });
        this.itemService = new ItemService_1.ItemService();
    }
}
exports.ItemController = ItemController;
// Create controller instance
const itemController = new ItemController();
// Export controller methods
exports.createItem = itemController.createItem;
exports.getItemById = itemController.getItemById;
exports.updateItem = itemController.updateItem;
exports.deleteItem = itemController.deleteItem;
exports.searchItems = itemController.searchItems;
exports.getItemsByOwner = itemController.getItemsByOwner;
exports.getItemsByCategory = itemController.getItemsByCategory;
exports.getNearbyItems = itemController.getNearbyItems;
exports.setItemAvailability = itemController.setItemAvailability;
exports.addItemImage = itemController.addItemImage;
exports.removeItemImage = itemController.removeItemImage;
exports.getItemImages = itemController.getItemImages;
