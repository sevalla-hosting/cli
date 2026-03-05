import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, MetricsQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Database {
  id: string;
  name: string;
  display_name: string;
  status: string | null;
  type: string;
  version: string;
  resource_type_name: string | null;
  is_suspended: boolean;
  company_id?: string | null;
  project_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDatabaseBody {
  display_name: string;
  type: string;
  version: string;
  cluster_id: string;
  resource_type_id: string;
  db_name: string;
  db_password: string;
  db_user?: string;
  project_id?: string | null;
  extensions?: {
    enable_vector?: boolean;
    enable_postgis?: boolean;
    enable_cron?: boolean;
  };
}

export interface UpdateDatabaseBody {
  display_name?: string;
  resource_type_id?: string;
  project_id?: string | null;
}

export interface DatabaseBackup {
  id: string;
  name: string;
  display_name?: string;
  type: string;
  status: string;
  created_at: string;
}

export interface CreateBackupBody {
  display_name: string;
}

export interface InternalConnection {
  id: string;
  target_id: string;
  target_type: string;
  status?: string;
  created_at?: string;
}

export interface CreateInternalConnectionBody {
  target_id: string;
  target_type: string;
}

export interface IpRestriction {
  type: string;
  is_enabled: boolean;
  ip_list: string[];
}

export interface UpdateIpRestrictionBody {
  type: string;
  is_enabled: boolean;
  ip_list: string[];
}

export interface ResetPasswordBody {
  new_password: string;
}

export type MetricPoint = { timestamp: string; value: number };

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listDatabases(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<Database>> {
  return client.get<PaginatedResponse<Database>>('/databases', query as QueryParams);
}

export async function createDatabase(
  client: ApiClient,
  body: CreateDatabaseBody,
): Promise<Database> {
  return client.post<Database>('/databases', body);
}

export async function getDatabase(client: ApiClient, id: string): Promise<Database> {
  return client.get<Database>(`/databases/${id}`);
}

export async function updateDatabase(
  client: ApiClient,
  id: string,
  body: UpdateDatabaseBody,
): Promise<Database> {
  return client.patch<Database>(`/databases/${id}`, body);
}

export async function deleteDatabase(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/databases/${id}`);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function activateDatabase(client: ApiClient, id: string): Promise<Database> {
  return client.post<Database>(`/databases/${id}/activate`);
}

export async function suspendDatabase(client: ApiClient, id: string): Promise<Database> {
  return client.post<Database>(`/databases/${id}/suspend`);
}

export async function resetDatabasePassword(
  client: ApiClient,
  id: string,
  body: ResetPasswordBody,
): Promise<Database> {
  return client.post<Database>(`/databases/${id}/reset-password`, body);
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export async function getDatabaseCpuUsage(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/cpu-usage`, query as QueryParams);
}

export async function getDatabaseCpuLimit(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/cpu-limit`, query as QueryParams);
}

export async function getDatabaseMemoryUsage(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/memory-usage`, query as QueryParams);
}

export async function getDatabaseMemoryLimit(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/memory-limit`, query as QueryParams);
}

export async function getDatabaseStorageUsage(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/storage-usage`, query as QueryParams);
}

export async function getDatabaseStorageLimit(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/storage-limit`, query as QueryParams);
}

export async function getDatabaseAllStorage(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/all-storage`, query as QueryParams);
}

export async function getDatabaseUsedStorage(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/databases/${id}/metrics/used-storage`, query as QueryParams);
}

// ---------------------------------------------------------------------------
// Backups
// ---------------------------------------------------------------------------

export async function listDatabaseBackups(
  client: ApiClient,
  id: string,
  query?: { type?: string },
): Promise<DatabaseBackup[]> {
  return client.get<DatabaseBackup[]>(`/databases/${id}/backups`, query as QueryParams);
}

export async function createDatabaseBackup(
  client: ApiClient,
  id: string,
  body: CreateBackupBody,
): Promise<DatabaseBackup> {
  return client.post<DatabaseBackup>(`/databases/${id}/backups`, body);
}

export async function deleteDatabaseBackup(
  client: ApiClient,
  id: string,
  backupId: string,
): Promise<void> {
  return client.delete<undefined>(`/databases/${id}/backups/${backupId}`);
}

export async function restoreDatabaseBackup(
  client: ApiClient,
  id: string,
  backupId: string,
): Promise<Database> {
  return client.post<Database>(`/databases/${id}/backups/${backupId}/restore`);
}

// ---------------------------------------------------------------------------
// Internal Connections
// ---------------------------------------------------------------------------

export async function listInternalConnections(
  client: ApiClient,
  id: string,
): Promise<InternalConnection[]> {
  return client.get<InternalConnection[]>(`/databases/${id}/internal-connections`);
}

export async function createInternalConnection(
  client: ApiClient,
  id: string,
  body: CreateInternalConnectionBody,
): Promise<InternalConnection> {
  return client.post<InternalConnection>(`/databases/${id}/internal-connections`, body);
}

export async function deleteInternalConnection(
  client: ApiClient,
  id: string,
  connectionId: string,
): Promise<void> {
  return client.delete<undefined>(`/databases/${id}/internal-connections/${connectionId}`);
}

// ---------------------------------------------------------------------------
// External Connection
// ---------------------------------------------------------------------------

export async function toggleExternalConnection(client: ApiClient, id: string): Promise<Database> {
  return client.post<Database>(`/databases/${id}/external-connection/toggle`);
}

// ---------------------------------------------------------------------------
// IP Restriction
// ---------------------------------------------------------------------------

export async function getDatabaseIpRestriction(
  client: ApiClient,
  id: string,
): Promise<IpRestriction> {
  return client.get<IpRestriction>(`/databases/${id}/ip-restriction`);
}

export async function updateDatabaseIpRestriction(
  client: ApiClient,
  id: string,
  body: UpdateIpRestrictionBody,
): Promise<IpRestriction> {
  return client.put<IpRestriction>(`/databases/${id}/ip-restriction`, body);
}
