import type { ApiClient } from '../api-client.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GitProvider {
  id: string;
  type: string;
  name: string;
  is_connected: boolean;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export async function listGitProviders(client: ApiClient): Promise<GitProvider[]> {
  return client.get<GitProvider[]>('/git/providers');
}
