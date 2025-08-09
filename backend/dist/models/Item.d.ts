export interface Item {
    id: string;
    owner_id: string;
    category_id: string;
    title: string;
    description: string;
    condition_rating: number;
    estimated_value?: number;
    daily_rate?: number;
    location_lat?: number;
    location_lng?: number;
    location_address?: string;
    is_available: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface CreateItemData {
    category_id: string;
    title: string;
    description: string;
    condition_rating: number;
    estimated_value?: number;
    daily_rate?: number;
    location_lat?: number;
    location_lng?: number;
    location_address?: string;
}
export interface UpdateItemData {
    category_id?: string;
    title?: string;
    description?: string;
    condition_rating?: number;
    estimated_value?: number;
    daily_rate?: number;
    location_lat?: number;
    location_lng?: number;
    location_address?: string;
    is_available?: boolean;
}
export interface ItemImage {
    id: string;
    item_id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
    sort_order: number;
    created_at: Date;
}
export interface ItemWithDetails extends Item {
    owner: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
        average_rating: number;
        reviews_count: number;
    };
    category: {
        id: string;
        name: string;
        icon?: string;
        color?: string;
    };
    images: ItemImage[];
    distance?: number;
}
export interface ItemSearchFilters {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    condition_rating?: number;
    location_lat?: number;
    location_lng?: number;
    radius?: number;
    search?: string;
    is_available?: boolean;
}
export interface ItemSearchResult extends ItemWithDetails {
    relevance_score?: number;
}
