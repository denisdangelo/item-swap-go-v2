export interface PaginationOptions {
    page: number;
    limit: number;
}
export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare abstract class BaseRepository<T, CreateData, UpdateData> {
    protected abstract tableName: string;
    protected abstract selectFields: string;
    protected generateId(): string;
    protected buildWhereClause(filters: Record<string, any>): {
        clause: string;
        params: any[];
    };
    findById(id: string): Promise<T | null>;
    findAll(filters?: Record<string, any>): Promise<T[]>;
    findWithPagination(filters: Record<string, any> | undefined, pagination: PaginationOptions): Promise<PaginationResult<T>>;
    create(data: CreateData): Promise<T>;
    update(id: string, data: UpdateData): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    softDelete(id: string): Promise<T | null>;
    exists(id: string): Promise<boolean>;
    count(filters?: Record<string, any>): Promise<number>;
}
