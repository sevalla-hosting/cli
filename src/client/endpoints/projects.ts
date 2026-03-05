import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectBody {
  display_name: string;
}

export interface UpdateProjectBody {
  display_name: string;
}

export interface AddServiceBody {
  service_id: string;
  service_type: string;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listProjects(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<Project>> {
  return client.get<PaginatedResponse<Project>>('/projects', query as QueryParams);
}

export async function createProject(client: ApiClient, body: CreateProjectBody): Promise<Project> {
  return client.post<Project>('/projects', body);
}

export async function getProject(client: ApiClient, id: string): Promise<Project> {
  return client.get<Project>(`/projects/${id}`);
}

export async function updateProject(
  client: ApiClient,
  id: string,
  body: UpdateProjectBody,
): Promise<Project> {
  return client.patch<Project>(`/projects/${id}`, body);
}

export async function deleteProject(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/projects/${id}`);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function addProjectService(
  client: ApiClient,
  id: string,
  body: AddServiceBody,
): Promise<Project> {
  return client.post<Project>(`/projects/${id}/services`, body);
}

export async function removeProjectService(
  client: ApiClient,
  id: string,
  serviceId: string,
): Promise<void> {
  return client.delete<undefined>(`/projects/${id}/services/${serviceId}`);
}
