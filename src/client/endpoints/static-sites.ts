import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, MetricsQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StaticSite {
  id: string;
  name: string;
  display_name: string;
  status: string | null;
  repo_url: string;
  default_branch: string;
  source: string;
  auto_deploy: boolean;
  is_preview_enabled: boolean;
  allow_deploy_paths: string[];
  ignore_deploy_paths: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateStaticSiteBody {
  display_name: string;
  repo_url: string;
  default_branch: string;
  source?: string;
  git_type?: string;
  auto_deploy?: boolean;
  is_preview_enabled?: boolean;
  install_command?: string;
  build_command?: string;
  published_directory?: string;
  root_directory?: string;
  node_version?: string;
  index_file?: string;
  error_file?: string;
  project_id?: string;
  allow_deploy_paths?: string[];
  ignore_deploy_paths?: string[];
}

export interface UpdateStaticSiteBody {
  display_name?: string;
  auto_deploy?: boolean;
  default_branch?: string;
  build_command?: string | null;
  node_version?: string | null;
  published_directory?: string | null;
  is_preview_enabled?: boolean;
  allow_deploy_paths?: string[];
  ignore_deploy_paths?: string[];
}

export interface Deployment {
  id: string;
  status: string;
  branch: string;
  commit_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface TriggerDeploymentBody {
  branch?: string;
  deployment_id?: string;
}

export interface DeploymentLog {
  timestamp: string;
  message: string;
  severity?: string;
}

export interface Domain {
  id: string;
  name: string;
  domain_name?: string;
  status: string;
  is_primary: boolean;
  is_wildcard?: boolean;
  type?: string;
  created_at: string;
}

export interface AddDomainBody {
  domain_name: string;
  is_wildcard?: boolean;
  custom_ssl_cert?: string;
  custom_ssl_key?: string;
}

export interface UpdateDomainBody {
  name: string;
}

export interface EnvVar {
  id: string;
  key: string;
  value: string;
  is_production?: boolean;
  is_preview?: boolean;
  branch?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEnvVarBody {
  key: string;
  value: string;
  is_production?: boolean;
  is_preview?: boolean;
  branch?: string;
}

export interface UpdateEnvVarBody {
  key?: string;
  value?: string;
  is_production?: boolean;
  is_preview?: boolean;
  branch?: string | null;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  severity?: string;
}

export interface LogsQuery {
  from?: string;
  to?: string;
  filters?: string;
  limit?: number;
}

export type MetricPoint = { timestamp: string; value: number };

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listStaticSites(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<StaticSite>> {
  return client.get<PaginatedResponse<StaticSite>>('/static-sites', query as QueryParams);
}

export async function createStaticSite(
  client: ApiClient,
  body: CreateStaticSiteBody,
): Promise<StaticSite> {
  return client.post<StaticSite>('/static-sites', body);
}

export async function getStaticSite(client: ApiClient, id: string): Promise<StaticSite> {
  return client.get<StaticSite>(`/static-sites/${id}`);
}

export async function updateStaticSite(
  client: ApiClient,
  id: string,
  body: UpdateStaticSiteBody,
): Promise<StaticSite> {
  return client.patch<StaticSite>(`/static-sites/${id}`, body);
}

export async function deleteStaticSite(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/static-sites/${id}`);
}

// ---------------------------------------------------------------------------
// Deployments
// ---------------------------------------------------------------------------

export async function listStaticSiteDeployments(
  client: ApiClient,
  id: string,
  query?: PaginationQuery,
): Promise<PaginatedResponse<Deployment>> {
  return client.get<PaginatedResponse<Deployment>>(
    `/static-sites/${id}/deployments`,
    query as QueryParams,
  );
}

export async function triggerStaticSiteDeployment(
  client: ApiClient,
  id: string,
  body: TriggerDeploymentBody,
): Promise<Deployment> {
  return client.post<Deployment>(`/static-sites/${id}/deployments`, body);
}

export async function getStaticSiteDeployment(
  client: ApiClient,
  id: string,
  deploymentId: string,
): Promise<Deployment> {
  return client.get<Deployment>(`/static-sites/${id}/deployments/${deploymentId}`);
}

export async function cancelStaticSiteDeployment(
  client: ApiClient,
  id: string,
  deploymentId: string,
): Promise<Deployment> {
  return client.post<Deployment>(`/static-sites/${id}/deployments/${deploymentId}/cancel`);
}

export async function getStaticSiteDeploymentLogs(
  client: ApiClient,
  id: string,
  deploymentId: string,
  query?: LogsQuery,
): Promise<DeploymentLog[]> {
  return client.get<DeploymentLog[]>(
    `/static-sites/${id}/deployments/${deploymentId}/logs`,
    query as QueryParams,
  );
}

// ---------------------------------------------------------------------------
// Domains
// ---------------------------------------------------------------------------

export async function listStaticSiteDomains(
  client: ApiClient,
  id: string,
  query?: PaginationQuery,
): Promise<PaginatedResponse<Domain>> {
  return client.get<PaginatedResponse<Domain>>(`/static-sites/${id}/domains`, query as QueryParams);
}

export async function addStaticSiteDomain(
  client: ApiClient,
  id: string,
  body: AddDomainBody,
): Promise<Domain> {
  return client.post<Domain>(`/static-sites/${id}/domains`, body);
}

export async function getStaticSiteDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.get<Domain>(`/static-sites/${id}/domains/${domainId}`);
}

export async function updateStaticSiteDomain(
  client: ApiClient,
  id: string,
  domainId: string,
  body: UpdateDomainBody,
): Promise<Domain> {
  return client.patch<Domain>(`/static-sites/${id}/domains/${domainId}`, body);
}

export async function deleteStaticSiteDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<void> {
  return client.delete<undefined>(`/static-sites/${id}/domains/${domainId}`);
}

export async function refreshStaticSiteDomainStatus(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`/static-sites/${id}/domains/${domainId}/refresh-status`);
}

export async function setStaticSitePrimaryDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`/static-sites/${id}/domains/${domainId}/set-primary`);
}

export async function toggleStaticSiteDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`/static-sites/${id}/domains/${domainId}/toggle`);
}

// ---------------------------------------------------------------------------
// Environment Variables
// ---------------------------------------------------------------------------

export async function listStaticSiteEnvVars(client: ApiClient, id: string): Promise<EnvVar[]> {
  return client.get<EnvVar[]>(`/static-sites/${id}/env-vars`);
}

export async function createStaticSiteEnvVar(
  client: ApiClient,
  id: string,
  body: CreateEnvVarBody,
): Promise<EnvVar> {
  return client.post<EnvVar>(`/static-sites/${id}/env-vars`, body);
}

export async function updateStaticSiteEnvVar(
  client: ApiClient,
  id: string,
  envVarId: string,
  body: UpdateEnvVarBody,
): Promise<EnvVar> {
  return client.put<EnvVar>(`/static-sites/${id}/env-vars/${envVarId}`, body);
}

export async function deleteStaticSiteEnvVar(
  client: ApiClient,
  id: string,
  envVarId: string,
): Promise<void> {
  return client.delete<undefined>(`/static-sites/${id}/env-vars/${envVarId}`);
}

// ---------------------------------------------------------------------------
// Logs
// ---------------------------------------------------------------------------

export async function getStaticSiteAccessLogs(
  client: ApiClient,
  id: string,
  query?: LogsQuery,
): Promise<LogEntry[]> {
  return client.get<LogEntry[]>(`/static-sites/${id}/access-logs`, query as QueryParams);
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export async function getStaticSiteRequestsPerMinute(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `/static-sites/${id}/metrics/requests-per-minute`,
    query as QueryParams,
  );
}

export async function getStaticSiteResponseTime(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `/static-sites/${id}/metrics/response-time`,
    query as QueryParams,
  );
}

export async function getStaticSiteResponseTimeAvg(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `/static-sites/${id}/metrics/response-time-avg`,
    query as QueryParams,
  );
}

export async function getStaticSiteStatusCodes(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `/static-sites/${id}/metrics/status-codes`,
    query as QueryParams,
  );
}

export async function getStaticSiteTopStatusCodes(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `/static-sites/${id}/metrics/top-status-codes`,
    query as QueryParams,
  );
}

export async function getStaticSiteTopCountries(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `/static-sites/${id}/metrics/top-countries`,
    query as QueryParams,
  );
}

export async function getStaticSiteSlowestRequests(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `/static-sites/${id}/metrics/slowest-requests`,
    query as QueryParams,
  );
}

export async function getStaticSiteTopPages(
  client: ApiClient,
  id: string,
  query: MetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(`/static-sites/${id}/metrics/top-pages`, query as QueryParams);
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

export async function purgeStaticSiteCache(client: ApiClient, id: string): Promise<void> {
  return client.post<undefined>(`/static-sites/${id}/purge-cache`);
}
