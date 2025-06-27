export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export interface PaginationParams {
    page: number;
    pageSize: number;
    from: number;
    to: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_more: boolean;
  };
  links: {
    next: string | null;
    prev: string | null;
  };
}

export interface ApiError {
  error: {
    code: number;
    message: string;
  };
}

// Use discriminated union for type safety
export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: number; message: string } };
