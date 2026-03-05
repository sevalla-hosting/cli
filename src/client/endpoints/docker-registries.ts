import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DockerRegistry {
  id: string;
  name: string;
  registry: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDockerRegistryBody {
  name: string;
  registry?: string;
  username: string;
  secret: string;
}

export interface UpdateDockerRegistryBody {
  name?: string;
  registry?: string;
  username?: string;
  secret?: string;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listDockerRegistries(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<DockerRegistry>> {
  return client.get<PaginatedResponse<DockerRegistry>>('/docker-registries', query as QueryParams);
}

export async function createDockerRegistry(
  client: ApiClient,
  body: CreateDockerRegistryBody,
): Promise<DockerRegistry> {
  return client.post<DockerRegistry>('/docker-registries', body);
}

export async function getDockerRegistry(client: ApiClient, id: string): Promise<DockerRegistry> {
  return client.get<DockerRegistry>(`/docker-registries/${id}`);
}

export async function updateDockerRegistry(
  client: ApiClient,
  id: string,
  body: UpdateDockerRegistryBody,
): Promise<DockerRegistry> {
  return client.patch<DockerRegistry>(`/docker-registries/${id}`, body);
}

export async function deleteDockerRegistry(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/docker-registries/${id}`);
}
