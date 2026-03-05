import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiKey {
  id: string;
  name: string;
  token?: string;
  is_enabled: boolean;
  expired_at?: string | null;
  role_ids?: string[];
  capabilities?: ApiKeyCapability[];
  created_at: string;
  updated_at: string;
}

export interface ApiKeyCapability {
  permission: string;
  id_resource?: string;
}

export interface CreateApiKeyBody {
  name: string;
  role_ids?: string[];
  capabilities?: ApiKeyCapability[];
  expired_at?: string;
}

export interface UpdateApiKeyBody {
  name?: string;
  role_ids?: string[];
  capabilities?: ApiKeyCapability[];
}

export interface RotateApiKeyBody {
  old_token_ttl_hours?: number;
}

export interface ApiKeyValidation {
  is_valid: boolean;
  key?: ApiKey;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listApiKeys(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<ApiKey>> {
  return client.get<PaginatedResponse<ApiKey>>('/api-keys', query as QueryParams);
}

export async function createApiKey(client: ApiClient, body: CreateApiKeyBody): Promise<ApiKey> {
  return client.post<ApiKey>('/api-keys', body);
}

export async function getApiKey(client: ApiClient, id: string): Promise<ApiKey> {
  return client.get<ApiKey>(`/api-keys/${id}`);
}

export async function updateApiKey(
  client: ApiClient,
  id: string,
  body: UpdateApiKeyBody,
): Promise<ApiKey> {
  return client.patch<ApiKey>(`/api-keys/${id}`, body);
}

export async function deleteApiKey(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/api-keys/${id}`);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function toggleApiKey(client: ApiClient, id: string): Promise<ApiKey> {
  return client.post<ApiKey>(`/api-keys/${id}/toggle`);
}

export async function rotateApiKey(
  client: ApiClient,
  id: string,
  body?: RotateApiKeyBody,
): Promise<ApiKey> {
  return client.post<ApiKey>(`/api-keys/${id}/rotate`, body);
}

// ---------------------------------------------------------------------------
// Validate
// ---------------------------------------------------------------------------

export async function validateApiKey(client: ApiClient): Promise<ApiKeyValidation> {
  return client.get<ApiKeyValidation>('/api-keys/validate');
}
