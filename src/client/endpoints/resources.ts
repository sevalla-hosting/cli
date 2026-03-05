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
