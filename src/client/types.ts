export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface PaginationQuery {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  offset?: number;
  limit?: number;
}

export interface MetricsQuery extends QueryParams {
  from?: string;
  to?: string;
  interval_in_seconds?: string;
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
