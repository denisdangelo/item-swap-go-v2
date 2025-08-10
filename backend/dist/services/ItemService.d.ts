import { CreateItemData, Item, ItemImage, ItemSearchFilters, ItemSearchResult, ItemWithDetails, UpdateItemData } from '@/models/Item';
import { PaginationOptions, PaginationResult } from '@/repositories/BaseRepository';
export declare class ItemService {
    private itemRepository;
    private categoryRepository;
    private userRepository;
    constructor();
    createItem(itemData: CreateItemData, ownerId: string): Promise<ItemWithDetails>;
    getItemById(id: string): Promise<ItemWithDetails>;
    updateItem(id: string, updateData: UpdateItemData, userId: string): Promise<ItemWithDetails>;
    deleteItem(id: string, userId: string): Promise<void>;
    searchItems(filters: ItemSearchFilters, pagination: PaginationOptions, userLat?: number, userLng?: number): Promise<PaginationResult<ItemSearchResult>>;
    getItemsByOwner(ownerId: string): Promise<Item[]>;
    getItemsByCategory(categoryId: string): Promise<Item[]>;
    getNearbyItems(lat: number, lng: number, radiusKm?: number, limit?: number): Promise<ItemWithDetails[]>;
    setItemAvailability(id: string, isAvailable: boolean, userId: string): Promise<ItemWithDetails>;
    addItemImage(itemId: string, imageUrl: string, altText?: string, isPrimary?: boolean, userId?: string): Promise<ItemImage>;
    removeItemImage(imageId: string, userId: string): Promise<void>;
    getItemImages(itemId: string): Promise<ItemImage[]>;
    private validateItemData;
    private validateItemUpdateData;
    private validateSearchFilters;
    private validateLocation;
}
