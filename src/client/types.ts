export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface PaginationQuery {
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface MetricsQuery extends QueryParams {
  from?: string;
  to?: string;
  interval?: string;
}

export interface ApiErrorBody {
  message: string;
  status: number;
  data?: {
    code?: string;
    message?: string;
  };
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: QueryParams;
  body?: unknown;
}
