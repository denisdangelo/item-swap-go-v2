import { CreateItemData, Item, ItemImage, ItemSearchFilters, ItemSearchResult, ItemWithDetails, UpdateItemData } from '@/models/Item';
import { BaseRepository, PaginationOptions, PaginationResult } from './BaseRepository';
export declare class ItemRepository extends BaseRepository<Item, CreateItemData, UpdateItemData> {
    protected tableName: string;
    protected selectFields: string;
    create(data: CreateItemData, ownerId: string): Promise<Item>;
    findByOwner(ownerId: string): Promise<Item[]>;
    findByCategory(categoryId: string): Promise<Item[]>;
    findWithDetails(id: string): Promise<ItemWithDetails | null>;
    searchItems(filters: ItemSearchFilters, pagination: PaginationOptions, userLat?: number, userLng?: number): Promise<PaginationResult<ItemSearchResult>>;
    getItemImages(itemId: string): Promise<ItemImage[]>;
    addImage(itemId: string, url: string, altText?: string, isPrimary?: boolean): Promise<ItemImage>;
    removeImage(imageId: string): Promise<boolean>;
    findNearby(lat: number, lng: number, radiusKm?: number, limit?: number): Promise<ItemWithDetails[]>;
    isOwner(itemId: string, userId: string): Promise<boolean>;
    setAvailability(id: string, isAvailable: boolean): Promise<boolean>;
}
