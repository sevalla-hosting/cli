import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UsageAlertTrigger {
  id: string;
  percentage: number;
  last_fired_at: string | null;
}

export interface UsageAlertConfig {
  id: string;
  company_id: string;
  project_id: string | null;
  limit_usd: number;
  emails: string[];
  triggers: UsageAlertTrigger[];
  created_at: string;
  updated_at: string;
}

export interface CreateUsageAlertBody {
  limit_usd: number;
  emails: string[];
  triggers: Array<{ percentage: number }>;
  project_id?: string | null;
}

export interface UpdateUsageAlertBody {
  limit_usd?: number;
  emails?: string[];
  triggers?: Array<{ percentage: number }>;
}

export interface ListUsageAlertsQuery extends PaginationQuery {
  project_id?: string;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export async function listUsageAlerts(
  client: ApiClient,
  query?: ListUsageAlertsQuery,
): Promise<PaginatedResponse<UsageAlertConfig>> {
  return client.get<PaginatedResponse<UsageAlertConfig>>(
    '/usage-alerts',
    query as QueryParams | undefined,
  );
}

export async function createUsageAlert(
  client: ApiClient,
  body: CreateUsageAlertBody,
): Promise<UsageAlertConfig> {
  return client.post<UsageAlertConfig>('/usage-alerts', body);
}

export async function getUsageAlert(client: ApiClient, id: string): Promise<UsageAlertConfig> {
  return client.get<UsageAlertConfig>(`/usage-alerts/${id}`);
}

export async function updateUsageAlert(
  client: ApiClient,
  id: string,
  body: UpdateUsageAlertBody,
): Promise<UsageAlertConfig> {
  return client.patch<UsageAlertConfig>(`/usage-alerts/${id}`, body);
}

export async function deleteUsageAlert(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/usage-alerts/${id}`);
}
