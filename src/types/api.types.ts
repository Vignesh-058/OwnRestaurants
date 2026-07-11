export interface ApiResponse<T> {
 status: 'success' | 'error';
 message?: string;
 data: T;
}

export interface Pagination {
 currentPage: number;
 totalPages: number;
 totalItems: number;
 itemsPerPage: number;
}
