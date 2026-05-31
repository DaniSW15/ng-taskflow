export interface Board {
    id: string;
    title: string;
    description?: string;
    ownerId: string;
    taskCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedList<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface CursorPaginatedList<T> {
    items: T[];
    nextCursor: string | null;
    hasNextPage: boolean;
    pageSize: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    errors: string[] | null;
}
