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
  
  export interface ApiResponse<T = any> {
    data?: T;
    error?: {
      code: number;
      message: string;
    };

    
  }
