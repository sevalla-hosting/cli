import { SevallaApiError } from '../errors/api-error.ts';
import type { ApiErrorBody, QueryParams, RequestOptions } from './types.ts';
import { getBaseUrl } from '../helpers/config.ts';
import { getToken } from '../auth/token-store.ts';

export class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(opts: { baseUrl?: string; token?: string } = {}) {
    this.baseUrl = opts.baseUrl ?? getBaseUrl();
    this.token = opts.token;
  }

  private buildUrl(path: string, query?: QueryParams): string {
    if (/\.\.\//.test(path)) {
      throw new Error('Path traversal detected in API path.');
    }
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${base}${normalizedPath}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  async request<T>(opts: RequestOptions): Promise<T> {
    const url = this.buildUrl(opts.path, opts.query);
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (opts.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method: opts.method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: AbortSignal.timeout(30_000),
    });

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      let errorBody: ApiErrorBody | undefined;
      try {
        errorBody = (await response.json()) as ApiErrorBody;
      } catch {
        // ignore parse errors
      }

      throw new SevallaApiError(
        response.status,
        errorBody?.message ?? response.statusText,
        errorBody?.data,
      );
    }

    return (await response.json()) as T;
  }

  async get<T>(path: string, query?: QueryParams): Promise<T> {
    return this.request<T>({ method: 'GET', path, query });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'POST', path, body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, body });
  }

  async delete<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, body });
  }
}

export function createClient(opts: { apiUrl?: string } = {}): ApiClient {
  const token = getToken();
  return new ApiClient({
    baseUrl: opts.apiUrl ? opts.apiUrl : undefined,
    token: token ?? undefined,
  });
}
