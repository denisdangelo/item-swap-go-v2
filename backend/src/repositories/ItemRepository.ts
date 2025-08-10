import { executeQuery } from '@/config/database';
import {
  CreateItemData,
  Item,
  ItemImage,
  ItemSearchFilters,
  ItemSearchResult,
  ItemWithDetails,
  UpdateItemData,
} from '@/models/Item';
import { BaseRepository, PaginationOptions, PaginationResult } from './BaseRepository';

export class ItemRepository extends BaseRepository<Item, CreateItemData, UpdateItemData> {
  protected tableName = 'items';
  protected selectFields = `
    id, owner_id, category_id, title, description, condition_rating,
    estimated_value, daily_rate, location_lat, location_lng, location_address,
    is_available, is_active, created_at, updated_at
  `;

  // Create item with owner_id
  async create(data: CreateItemData, ownerId: string): Promise<Item> {
    const itemData = { ...data, owner_id: ownerId };
    return super.create(itemData as any);
  }

  // Find items by owner
  async findByOwner(ownerId: string): Promise<Item[]> {
    return this.findAll({ owner_id: ownerId, is_active: true });
  }

  // Find items by category
  async findByCategory(categoryId: string): Promise<Item[]> {
    return this.findAll({ category_id: categoryId, is_active: true, is_available: true });
  }

  // Get item with full details
  async findWithDetails(id: string): Promise<ItemWithDetails | null> {
    const query = `
      SELECT 
        i.id, i.owner_id, i.category_id, i.title, i.description, i.condition_rating,
        i.estimated_value, i.daily_rate, i.location_lat, i.location_lng, i.location_address,
        i.is_available, i.is_active, i.created_at, i.updated_at,
        
        u.id as owner_id, u.first_name as owner_first_name, u.last_name as owner_last_name,
        u.avatar_url as owner_avatar_url,
        
        c.id as category_id, c.name as category_name, c.icon as category_icon, c.color as category_color,
        
        COALESCE(AVG(r.rating), 0) as owner_average_rating,
        COUNT(DISTINCT r.id) as owner_reviews_count
      FROM items i
      JOIN users u ON i.owner_id = u.id
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN reviews r ON u.id = r.reviewed_id
      WHERE i.id = ? AND i.is_active = true
      GROUP BY i.id
    `;

    const rows = await executeQuery<any[]>(query, [id]);
    if (rows.length === 0) return null;

    const row = rows[0];
    const images = await this.getItemImages(id);

    return {
      id: row.id,
      owner_id: row.owner_id,
      category_id: row.category_id,
      title: row.title,
      description: row.description,
      condition_rating: row.condition_rating,
      estimated_value: row.estimated_value,
      daily_rate: row.daily_rate,
      location_lat: row.location_lat,
      location_lng: row.location_lng,
      location_address: row.location_address,
      is_available: row.is_available,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      owner: {
        id: row.owner_id,
        first_name: row.owner_first_name,
        last_name: row.owner_last_name,
        avatar_url: row.owner_avatar_url,
        average_rating: row.owner_average_rating,
        reviews_count: row.owner_reviews_count,
      },
      category: {
        id: row.category_id,
        name: row.category_name,
        icon: row.category_icon,
        color: row.category_color,
      },
      images,
    };
  }

  // Search items with filters and pagination
  async searchItems(
    filters: ItemSearchFilters,
    pagination: PaginationOptions,
    userLat?: number,
    userLng?: number
  ): Promise<PaginationResult<ItemSearchResult>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build WHERE conditions and parameter buckets
    const conditions: string[] = ['i.is_active = true', 'i.is_available = true'];
    const whereParams: any[] = [];
    const distanceParams: any[] = [];
    const searchSelectParams: any[] = [];
    const searchWhereParams: any[] = [];

    if (filters.category_id) {
      conditions.push('i.category_id = ?');
      whereParams.push(filters.category_id);
    }

    if (filters.min_price !== undefined) {
      conditions.push('i.daily_rate >= ?');
      whereParams.push(filters.min_price);
    }

    if (filters.max_price !== undefined) {
      conditions.push('i.daily_rate <= ?');
      whereParams.push(filters.max_price);
    }

    if (filters.condition_rating) {
      conditions.push('i.condition_rating >= ?');
      whereParams.push(filters.condition_rating);
    }

    // Location-based search
    let distanceSelect = '';
    let havingClause = '';
    if (filters.location_lat && filters.location_lng && filters.radius) {
      distanceSelect = `, (6371 * acos(cos(radians(?)) * cos(radians(i.location_lat)) * 
                         cos(radians(i.location_lng) - radians(?)) + 
                         sin(radians(?)) * sin(radians(i.location_lat)))) AS distance`;
      distanceParams.push(filters.location_lat, filters.location_lng, filters.location_lat);
      havingClause = `HAVING distance <= ${filters.radius}`;
    } else if (userLat && userLng) {
      distanceSelect = `, (6371 * acos(cos(radians(?)) * cos(radians(i.location_lat)) * 
                         cos(radians(i.location_lng) - radians(?)) + 
                         sin(radians(?)) * sin(radians(i.location_lat)))) AS distance`;
      distanceParams.push(userLat, userLng, userLat);
    }

    // Text search
    let matchClause = '';
    if (filters.search) {
      matchClause =
        ', MATCH(i.title, i.description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance_score';
      conditions.push(
        '(MATCH(i.title, i.description) AGAINST(? IN NATURAL LANGUAGE MODE) OR i.title LIKE ? OR i.description LIKE ?)'
      );
      const searchTerm = filters.search;
      const searchPattern = `%${searchTerm}%`;
      // 1 param for SELECT-level MATCH, and 3 for WHERE (AGAINST + 2x LIKE)
      searchSelectParams.push(searchTerm);
      searchWhereParams.push(searchTerm, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query (use subselect whenever distance is computed to keep params in sync)
    let countQuery: string;
    let countParams: any[] = [];
    if (distanceSelect) {
      countQuery = `
        SELECT COUNT(*) as total FROM (
          SELECT i.id
          ${distanceSelect}
          FROM items i
          JOIN users u ON i.owner_id = u.id
          JOIN categories c ON i.category_id = c.id
          ${whereClause}
          ${havingClause}
        ) as sub
      `;
      countParams = [...distanceParams, ...whereParams, ...searchWhereParams];
    } else {
      countQuery = `
        SELECT COUNT(*) as total
        FROM items i
        ${whereClause}
      `;
      countParams = [...whereParams, ...searchWhereParams];
    }

    const countResult = await executeQuery<Array<{ total: number }>>(countQuery, countParams);
    const total = countResult[0].total;

    // Data query (avoid ONLY_FULL_GROUP_BY issues by using subqueries for aggregates)
    const dataQuery = `
      SELECT 
        i.id, i.owner_id, i.category_id, i.title, i.description, i.condition_rating,
        i.estimated_value, i.daily_rate, i.location_lat, i.location_lng, i.location_address,
        i.is_available, i.is_active, i.created_at, i.updated_at,
        
        u.first_name as owner_first_name, u.last_name as owner_last_name,
        u.avatar_url as owner_avatar_url,
        
        c.name as category_name, c.icon as category_icon, c.color as category_color,
        
        (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.reviewed_id = u.id) as owner_average_rating,
        (SELECT COUNT(DISTINCT r2.id) FROM reviews r2 WHERE r2.reviewed_id = u.id) as owner_reviews_count
        ${distanceSelect}
        ${matchClause}
      FROM items i
      JOIN users u ON i.owner_id = u.id
      JOIN categories c ON i.category_id = c.id
      ${whereClause}
      ${havingClause}
      ORDER BY ${filters.search ? 'relevance_score DESC,' : ''} ${distanceSelect ? 'distance ASC,' : ''} i.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const dataParams = [
      ...distanceParams,
      ...searchSelectParams,
      ...whereParams,
      ...searchWhereParams,
    ];
    const rows = await executeQuery<any[]>(dataQuery, dataParams);

    // Get images for each item
    const items: ItemSearchResult[] = [];
    for (const row of rows) {
      const images = await this.getItemImages(row.id);

      items.push({
        id: row.id,
        owner_id: row.owner_id,
        category_id: row.category_id,
        title: row.title,
        description: row.description,
        condition_rating: row.condition_rating,
        estimated_value: row.estimated_value,
        daily_rate: row.daily_rate,
        location_lat: row.location_lat,
        location_lng: row.location_lng,
        location_address: row.location_address,
        is_available: row.is_available,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at,
        owner: {
          id: row.owner_id,
          first_name: row.owner_first_name,
          last_name: row.owner_last_name,
          avatar_url: row.owner_avatar_url,
          average_rating: row.owner_average_rating,
          reviews_count: row.owner_reviews_count,
        },
        category: {
          id: row.category_id,
          name: row.category_name,
          icon: row.category_icon,
          color: row.category_color,
        },
        images,
        distance: row.distance,
        relevance_score: row.relevance_score,
      });
    }

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get item images
  async getItemImages(itemId: string): Promise<ItemImage[]> {
    const query = `
      SELECT id, item_id, url, alt_text, is_primary, sort_order, created_at
      FROM item_images
      WHERE item_id = ?
      ORDER BY is_primary DESC, sort_order ASC
    `;

    return executeQuery<ItemImage[]>(query, [itemId]);
  }

  // Add item image
  async addImage(
    itemId: string,
    url: string,
    altText?: string,
    isPrimary: boolean = false
  ): Promise<ItemImage> {
    const id = this.generateId();

    // If this is primary, unset other primary images
    if (isPrimary) {
      await executeQuery('UPDATE item_images SET is_primary = false WHERE item_id = ?', [itemId]);
    }

    const query = `
      INSERT INTO item_images (id, item_id, url, alt_text, is_primary, sort_order)
      VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM item_images WHERE item_id = ?))
    `;

    await executeQuery(query, [id, itemId, url, altText, isPrimary, itemId]);

    const images = await this.getItemImages(itemId);
    return images.find((img) => img.id === id)!;
  }

  // Remove item image
  async removeImage(imageId: string): Promise<boolean> {
    const query = 'DELETE FROM item_images WHERE id = ?';
    const result = await executeQuery<any>(query, [imageId]);
    return result.affectedRows > 0;
  }

  // Get nearby items
  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number = 10,
    limit: number = 20
  ): Promise<ItemWithDetails[]> {
    const query = `
      SELECT 
        i.id, i.owner_id, i.category_id, i.title, i.description, i.condition_rating,
        i.estimated_value, i.daily_rate, i.location_lat, i.location_lng, i.location_address,
        i.is_available, i.is_active, i.created_at, i.updated_at,
        
        u.first_name as owner_first_name, u.last_name as owner_last_name,
        u.avatar_url as owner_avatar_url,
        
        c.name as category_name, c.icon as category_icon, c.color as category_color,
        
        COALESCE(AVG(r.rating), 0) as owner_average_rating,
        COUNT(DISTINCT r.id) as owner_reviews_count,
        
        (6371 * acos(cos(radians(?)) * cos(radians(i.location_lat)) * 
         cos(radians(i.location_lng) - radians(?)) + 
         sin(radians(?)) * sin(radians(i.location_lat)))) AS distance
      FROM items i
      JOIN users u ON i.owner_id = u.id
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN reviews r ON u.id = r.reviewed_id
      WHERE i.is_active = true 
        AND i.is_available = true
        AND i.location_lat IS NOT NULL 
        AND i.location_lng IS NOT NULL
      GROUP BY i.id
      HAVING distance < ?
      ORDER BY distance
      LIMIT ?
    `;

    const rows = await executeQuery<any[]>(query, [lat, lng, lat, radiusKm, limit]);

    const items: ItemWithDetails[] = [];
    for (const row of rows) {
      const images = await this.getItemImages(row.id);

      items.push({
        id: row.id,
        owner_id: row.owner_id,
        category_id: row.category_id,
        title: row.title,
        description: row.description,
        condition_rating: row.condition_rating,
        estimated_value: row.estimated_value,
        daily_rate: row.daily_rate,
        location_lat: row.location_lat,
        location_lng: row.location_lng,
        location_address: row.location_address,
        is_available: row.is_available,
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at,
        owner: {
          id: row.owner_id,
          first_name: row.owner_first_name,
          last_name: row.owner_last_name,
          avatar_url: row.owner_avatar_url,
          average_rating: row.owner_average_rating,
          reviews_count: row.owner_reviews_count,
        },
        category: {
          id: row.category_id,
          name: row.category_name,
          icon: row.category_icon,
          color: row.category_color,
        },
        images,
        distance: row.distance,
      });
    }

    return items;
  }

  // Check if user owns item
  async isOwner(itemId: string, userId: string): Promise<boolean> {
    const query = 'SELECT 1 FROM items WHERE id = ? AND owner_id = ? LIMIT 1';
    const rows = await executeQuery<any[]>(query, [itemId, userId]);
    return rows.length > 0;
  }

  // Set item availability
  async setAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    const query = 'UPDATE items SET is_available = ? WHERE id = ?';
    const result = await executeQuery<any>(query, [isAvailable, id]);
    return result.affectedRows > 0;
  }
}
