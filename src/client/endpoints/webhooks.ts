import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Webhook {
  id: string;
  endpoint: string;
  description: string | null;
  allowed_events: string[];
  is_enabled: boolean;
  secret?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookBody {
  allowed_events: string[];
  endpoint: string;
  description?: string;
}

export interface UpdateWebhookBody {
  allowed_events?: string[];
  endpoint?: string;
  description?: string | null;
}

export interface RollSecretBody {
  expire_in_hours?: number;
}

export interface WebhookDelivery {
  id: string;
  event_type: string;
  status: string;
  response_code?: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listWebhooks(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<Webhook>> {
  return client.get<PaginatedResponse<Webhook>>('/webhooks', query as QueryParams);
}

export async function createWebhook(client: ApiClient, body: CreateWebhookBody): Promise<Webhook> {
  return client.post<Webhook>('/webhooks', body);
}

export async function getWebhook(client: ApiClient, id: string): Promise<Webhook> {
  return client.get<Webhook>(`/webhooks/${id}`);
}

export async function updateWebhook(
  client: ApiClient,
  id: string,
  body: UpdateWebhookBody,
): Promise<Webhook> {
  return client.patch<Webhook>(`/webhooks/${id}`, body);
}

export async function deleteWebhook(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/webhooks/${id}`);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function toggleWebhook(client: ApiClient, id: string): Promise<Webhook> {
  return client.post<Webhook>(`/webhooks/${id}/toggle`);
}

export async function rollWebhookSecret(
  client: ApiClient,
  id: string,
  body?: RollSecretBody,
): Promise<Webhook> {
  return client.post<Webhook>(`/webhooks/${id}/roll-secret`, body);
}

// ---------------------------------------------------------------------------
// Deliveries
// ---------------------------------------------------------------------------

export async function listWebhookDeliveries(
  client: ApiClient,
  id: string,
  query?: PaginationQuery,
): Promise<PaginatedResponse<WebhookDelivery>> {
  return client.get<PaginatedResponse<WebhookDelivery>>(
    `/webhooks/${id}/deliveries`,
    query as QueryParams,
  );
}

export async function getWebhookDelivery(
  client: ApiClient,
  id: string,
  deliveryId: string,
): Promise<WebhookDelivery> {
  return client.get<WebhookDelivery>(`/webhooks/${id}/deliveries/${deliveryId}`);
}
