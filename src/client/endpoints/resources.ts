import type { ApiClient } from '../api-client.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Cluster {
  id: string;
  name: string;
  display_name: string;
  location: string;
  is_available: boolean;
}

export interface DatabaseResourceType {
  id: string;
  name: string;
  display_name: string;
  cpu: number;
  memory: number;
  storage: number;
  is_available: boolean;
}

export interface ProcessResourceType {
  id: string;
  name: string;
  display_name: string;
  cpu: number;
  memory: number;
  is_available: boolean;
}

export interface ApiKeyPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface ApiKeyRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export async function listClusters(client: ApiClient): Promise<Cluster[]> {
  return client.get<Cluster[]>('/resources/clusters');
}

export async function listDatabaseResourceTypes(
  client: ApiClient,
): Promise<DatabaseResourceType[]> {
  return client.get<DatabaseResourceType[]>('/resources/database-resource-types');
}

export async function listProcessResourceTypes(client: ApiClient): Promise<ProcessResourceType[]> {
  return client.get<ProcessResourceType[]>('/resources/process-resource-types');
}

export async function listApiKeyPermissions(client: ApiClient): Promise<ApiKeyPermission[]> {
  return client.get<ApiKeyPermission[]>('/resources/rbac/api-key-permissions');
}

export async function listApiKeyRoles(client: ApiClient): Promise<ApiKeyRole[]> {
  return client.get<ApiKeyRole[]>('/resources/rbac/api-key-roles');
}
