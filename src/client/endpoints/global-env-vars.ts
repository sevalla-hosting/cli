import type { ApiClient } from '../api-client.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GlobalEnvVar {
  id: string;
  key: string;
  value: string;
  is_runtime: boolean;
  is_buildtime: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGlobalEnvVarBody {
  key: string;
  value: string;
  is_runtime?: boolean;
  is_buildtime?: boolean;
}

export interface UpdateGlobalEnvVarBody {
  key?: string;
  value?: string;
  is_runtime?: boolean;
  is_buildtime?: boolean;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export async function listGlobalEnvVars(client: ApiClient): Promise<GlobalEnvVar[]> {
  return client.get<GlobalEnvVar[]>('/applications/global-env-vars');
}

export async function createGlobalEnvVar(
  client: ApiClient,
  body: CreateGlobalEnvVarBody,
): Promise<GlobalEnvVar> {
  return client.post<GlobalEnvVar>('/applications/global-env-vars', body);
}

export async function updateGlobalEnvVar(
  client: ApiClient,
  id: string,
  body: UpdateGlobalEnvVarBody,
): Promise<GlobalEnvVar> {
  return client.put<GlobalEnvVar>(`/applications/global-env-vars/${id}`, body);
}

export async function deleteGlobalEnvVar(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/applications/global-env-vars/${id}`);
}
