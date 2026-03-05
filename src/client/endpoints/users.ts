import type { ApiClient } from '../api-client.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export async function listUsers(client: ApiClient): Promise<User[]> {
  return client.get<User[]>('/users');
}
