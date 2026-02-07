export type PagingPayload = {
    page?: number;
    size?: number;
    sort?: string;
    topic?: string;
    keyword?: string;
}

export type PageMeta = {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    sort: string;
    filter: Record<string, never>;
}

export type CursorMeta = {
    limit: number;
    nextCursor: string;
    prevCursor: string;
    filter: Record<string, never>;
}

export interface TableParams {
    page: number;
    size: number;
    sort?: string;
    keyword?: string;
    filters?: Record<string, any>;
    [key: string]: any;
}
