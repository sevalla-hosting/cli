import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ObjectStorageBucket {
  id: string;
  name: string;
  display_name: string;
  status: string | null;
  location: string;
  jurisdiction: string;
  public_access: boolean;
  project_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateObjectStorageBody {
  display_name: string;
  location?: string;
  jurisdiction?: string;
  public_access?: boolean;
  project_id?: string | null;
}

export interface UpdateObjectStorageBody {
  display_name?: string;
  project_id?: string | null;
}

export interface CorsPolicy {
  id: string;
  methods: string[];
  origins: string[];
  headers?: string[];
  created_at: string;
}

export interface CreateCorsPolicyBody {
  methods: string[];
  origins: string[];
  headers?: string[];
}

export interface UpdateCorsPolicyBody {
  methods: string[];
  origins: string[];
  headers?: string[];
}

export interface StorageObject {
  key: string;
  size: number;
  last_modified: string;
}

export interface DeleteObjectsBody {
  keys: string[];
}

export interface ObjectsQuery {
  prefix?: string;
  delimiter?: string;
  cursor?: string;
  limit?: number;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listObjectStorageBuckets(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<ObjectStorageBucket>> {
  return client.get<PaginatedResponse<ObjectStorageBucket>>(
    '/object-storage',
    query as QueryParams,
  );
}

export async function createObjectStorageBucket(
  client: ApiClient,
  body: CreateObjectStorageBody,
): Promise<ObjectStorageBucket> {
  return client.post<ObjectStorageBucket>('/object-storage', body);
}

export async function getObjectStorageBucket(
  client: ApiClient,
  id: string,
): Promise<ObjectStorageBucket> {
  return client.get<ObjectStorageBucket>(`/object-storage/${id}`);
}

export async function updateObjectStorageBucket(
  client: ApiClient,
  id: string,
  body: UpdateObjectStorageBody,
): Promise<ObjectStorageBucket> {
  return client.patch<ObjectStorageBucket>(`/object-storage/${id}`, body);
}

export async function deleteObjectStorageBucket(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/object-storage/${id}`);
}

// ---------------------------------------------------------------------------
// CDN Domain
// ---------------------------------------------------------------------------

export async function enableCdnDomain(client: ApiClient, id: string): Promise<ObjectStorageBucket> {
  return client.post<ObjectStorageBucket>(`/object-storage/${id}/domain`);
}

export async function disableCdnDomain(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/object-storage/${id}/domain`);
}

// ---------------------------------------------------------------------------
// CORS Policies
// ---------------------------------------------------------------------------

export async function listCorsPolicies(client: ApiClient, id: string): Promise<CorsPolicy[]> {
  return client.get<CorsPolicy[]>(`/object-storage/${id}/cors-policies`);
}

export async function createCorsPolicy(
  client: ApiClient,
  id: string,
  body: CreateCorsPolicyBody,
): Promise<CorsPolicy> {
  return client.post<CorsPolicy>(`/object-storage/${id}/cors-policies`, body);
}

export async function updateCorsPolicy(
  client: ApiClient,
  id: string,
  corsPolicyId: string,
  body: UpdateCorsPolicyBody,
): Promise<CorsPolicy> {
  return client.patch<CorsPolicy>(`/object-storage/${id}/cors-policies/${corsPolicyId}`, body);
}

export async function deleteCorsPolicy(
  client: ApiClient,
  id: string,
  corsPolicyId: string,
): Promise<void> {
  return client.delete<undefined>(`/object-storage/${id}/cors-policies/${corsPolicyId}`);
}

// ---------------------------------------------------------------------------
// Objects
// ---------------------------------------------------------------------------

export async function listObjects(
  client: ApiClient,
  id: string,
  query?: ObjectsQuery,
): Promise<StorageObject[]> {
  return client.get<StorageObject[]>(`/object-storage/${id}/objects`, query as QueryParams);
}

export async function deleteObjects(
  client: ApiClient,
  id: string,
  body: DeleteObjectsBody,
): Promise<void> {
  return client.delete<undefined>(`/object-storage/${id}/objects`, body);
}
