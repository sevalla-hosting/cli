import type { ApiClient } from '../api-client.ts';
import type { QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Path prefix
// ---------------------------------------------------------------------------

const BASE = '/v3/applications';

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export interface ListQuery {
  limit?: number;
  offset?: number;
}

export interface LogsQuery {
  from?: string;
  to?: string;
  filters?: string;
  limit?: number;
}

export interface AppMetricsQuery {
  from: string;
  to: string;
  interval_in_seconds?: number;
  filters?: string;
}

export interface ProcessMetricsQuery {
  from: string;
  to: string;
  interval_in_seconds: number;
}

// ---------------------------------------------------------------------------
// Paginated response wrapper
// ---------------------------------------------------------------------------

export interface PaginatedList<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

// ---------------------------------------------------------------------------
// Core resource types
// ---------------------------------------------------------------------------

export interface Application {
  id: string;
  name: string;
  display_name: string;
  status: string | null;
  type: string;
  source: string;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationDetail extends Application {
  company_id: string | null;
  project_id: string | null;
  namespace: string | null;
  build_cache_enabled: boolean;
  hibernation_enabled: boolean;
  hibernate_after_seconds: number | null;
  auto_deploy: boolean;
  wait_for_checks: boolean;
  git_type: string | null;
  repo_url: string | null;
  default_branch: string | null;
  docker_image: string | null;
  build_type: string;
  build_path: string | null;
  pack_builder: string | null;
  nixpacks_version: string | null;
  dockerfile_path: string | null;
  docker_context: string | null;
  allow_deploy_paths: string[];
  ignore_deploy_paths: string[];
  created_by: string | null;
}

export interface Deployment {
  id: string;
  app_id: string | null;
  status: string | null;
  type: string | null;
  trigger: string | null;
  steps: string[];
  docker_image_url: string | null;
  git_type: string | null;
  repo_url: string | null;
  branch: string | null;
  commit_sha: string | null;
  commit_message: string | null;
  author_login: string | null;
  author_img: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Process {
  id: string;
  app_id: string | null;
  key: string;
  type: string | null;
  display_name: string | null;
  entrypoint: string;
  port: number | null;
  is_ingress_enabled: boolean;
  ingress_protocol: string | null;
  scaling_strategy: Record<string, unknown> | null;
  resource_type_id: string | null;
  resource_type_name: string | null;
  cpu_limit: number | null;
  memory_limit: number | null;
  schedule: string | null;
  time_zone: string | null;
  job_start_policy: string | null;
  liveness_probe: Record<string, unknown> | null;
  readiness_probe: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface EnvVar {
  id: string;
  app_id: string;
  key: string;
  value: string;
  is_runtime: boolean | null;
  is_buildtime: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  name: string;
  status: string;
  type: string;
  is_enabled: boolean;
  is_wildcard: boolean;
  is_primary: boolean;
  dns_records: unknown;
  errors: unknown;
  created_at: string;
  updated_at: string;
}

export interface DeploymentHook {
  url: string;
}

export interface IpRestriction {
  type: string;
  is_enabled: boolean;
  ip_list: string[];
}

export interface TcpProxy {
  id: string;
  app_id: string;
  process_id: string;
  port: number;
  external_port: number;
  hostname: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PrivatePort {
  id: string;
  app_id: string;
  process_id: string;
  port: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface StatusCodePoint {
  time: string;
  value: Record<string, number>;
}

export interface TopStatusCode {
  status: string;
  total: number;
}

export interface TopCountry {
  country: string;
  response_time: number;
  total: number;
}

export interface SlowestRequest {
  id: string;
  client_request_method: string;
  client_request_path: string;
  average_response_time_ms: number;
  count_of_requests: number;
}

export interface TopPage {
  page: string;
  total: number;
}

export interface LogEntry {
  id: string;
  message: string;
  service: string;
  severity: string;
  timestamp: string;
  tags: Record<string, unknown>;
  attributes: Record<string, unknown>;
  unix_timestamp: number;
}

export interface CdnStatus {
  is_turned_on: boolean;
}

// ---------------------------------------------------------------------------
// Input types for create / update operations
// ---------------------------------------------------------------------------

export interface CreateApplicationInput {
  display_name: string;
  cluster_id: string;
  source: string;
  project_id?: string | null;
  git_type?: string | null;
  repo_url?: string | null;
  default_branch?: string | null;
  docker_image?: string | null;
  docker_registry_credential_id?: string | null;
}

export interface UpdateApplicationInput {
  display_name?: string;
  auto_deploy?: boolean;
  default_branch?: string;
  hibernation_enabled?: boolean;
  hibernate_after_seconds?: number;
  build_type?: string;
  build_path?: string;
  dockerfile_path?: string;
  docker_context?: string;
  build_cache_enabled?: boolean;
  docker_registry_credential_id?: string;
  pack_builder?: string;
  nixpacks_version?: string;
  buildpacks?: Array<{ order: number; source: string }>;
  allow_deploy_paths?: string[];
  ignore_deploy_paths?: string[];
  source?: string;
  git_type?: string;
  repo_url?: string;
  docker_image?: string;
}

export interface CloneApplicationInput {
  display_name: string;
  cluster_id?: string;
}

export interface TriggerDeploymentInput {
  branch?: string;
  docker_image?: string;
  is_restart?: boolean;
}

export interface CreateProcessInput {
  display_name: string;
  type: string;
  resource_type_id: string;
  entrypoint?: string;
  scaling_strategy?: Record<string, unknown>;
  port?: number;
  schedule?: string;
  time_zone?: string;
  job_start_policy?: string;
  liveness_probe?: Record<string, unknown>;
  readiness_probe?: Record<string, unknown>;
}

export interface UpdateProcessInput {
  display_name?: string;
  entrypoint?: string;
  type?: string;
  resource_type_id?: string;
  scaling_strategy?: Record<string, unknown>;
  port?: number;
  schedule?: string;
  time_zone?: string;
  job_start_policy?: string;
  liveness_probe?: Record<string, unknown> | null;
  readiness_probe?: Record<string, unknown> | null;
  is_ingress_enabled?: boolean;
  ingress_protocol?: string;
}

export interface CreateEnvVarInput {
  key: string;
  value: string;
  is_runtime?: boolean;
  is_buildtime?: boolean;
}

export interface UpdateEnvVarInput {
  key?: string;
  value?: string;
  is_runtime?: boolean;
  is_buildtime?: boolean;
}

export interface AddDomainInput {
  domain_name: string;
  is_wildcard?: boolean;
  custom_ssl_cert?: string;
  custom_ssl_key?: string;
}

export interface UpdateDomainInput {
  [key: string]: unknown;
}

export interface UpdateIpRestrictionInput {
  type: string;
  is_enabled: boolean;
  ip_list: string[];
}

export interface CreateTcpProxyInput {
  process_id: string;
  port: number;
}

export interface CreatePrivatePortInput {
  process_id: string;
  port: number;
}

// ---------------------------------------------------------------------------
// Application CRUD
// ---------------------------------------------------------------------------

export async function listApplications(
  client: ApiClient,
  query?: ListQuery,
): Promise<PaginatedList<Application>> {
  return client.get<PaginatedList<Application>>(BASE, query as QueryParams);
}

export async function createApplication(
  client: ApiClient,
  input: CreateApplicationInput,
): Promise<ApplicationDetail> {
  return client.post<ApplicationDetail>(BASE, input);
}

export async function getApplication(client: ApiClient, id: string): Promise<ApplicationDetail> {
  return client.get<ApplicationDetail>(`${BASE}/${id}`);
}

export async function updateApplication(
  client: ApiClient,
  id: string,
  input: UpdateApplicationInput,
): Promise<ApplicationDetail> {
  return client.patch<ApplicationDetail>(`${BASE}/${id}`, input);
}

export async function deleteApplication(client: ApiClient, id: string): Promise<void> {
  return client.delete(`${BASE}/${id}`);
}

// ---------------------------------------------------------------------------
// Application lifecycle
// ---------------------------------------------------------------------------

export async function activateApplication(client: ApiClient, id: string): Promise<void> {
  return client.post(`${BASE}/${id}/activate`);
}

export async function suspendApplication(client: ApiClient, id: string): Promise<void> {
  return client.post(`${BASE}/${id}/suspend`);
}

export async function cloneApplication(
  client: ApiClient,
  id: string,
  input: CloneApplicationInput,
): Promise<ApplicationDetail> {
  return client.post<ApplicationDetail>(`${BASE}/${id}/clone`, input);
}

// ---------------------------------------------------------------------------
// Deployments
// ---------------------------------------------------------------------------

export async function listDeployments(
  client: ApiClient,
  id: string,
  query?: ListQuery,
): Promise<PaginatedList<Deployment>> {
  return client.get<PaginatedList<Deployment>>(`${BASE}/${id}/deployments`, query as QueryParams);
}

export async function triggerDeployment(
  client: ApiClient,
  id: string,
  input?: TriggerDeploymentInput,
): Promise<Deployment> {
  return client.post<Deployment>(`${BASE}/${id}/deployments`, input);
}

export async function getDeployment(
  client: ApiClient,
  id: string,
  deploymentId: string,
): Promise<Deployment> {
  return client.get<Deployment>(`${BASE}/${id}/deployments/${deploymentId}`);
}

export async function rollbackDeployment(client: ApiClient, id: string): Promise<Deployment> {
  return client.post<Deployment>(`${BASE}/${id}/deployments/rollback`);
}

export async function cancelDeployment(
  client: ApiClient,
  id: string,
  deploymentId: string,
): Promise<void> {
  return client.post(`${BASE}/${id}/deployments/${deploymentId}/cancel`);
}

export async function getDeploymentLogs(
  client: ApiClient,
  id: string,
  deploymentId: string,
  query?: LogsQuery,
): Promise<LogEntry[]> {
  return client.get<LogEntry[]>(
    `${BASE}/${id}/deployments/${deploymentId}/logs`,
    query as QueryParams,
  );
}

// ---------------------------------------------------------------------------
// Processes
// ---------------------------------------------------------------------------

export async function listProcesses(
  client: ApiClient,
  id: string,
): Promise<PaginatedList<Process>> {
  return client.get<PaginatedList<Process>>(`${BASE}/${id}/processes`);
}

export async function createProcess(
  client: ApiClient,
  id: string,
  input: CreateProcessInput,
): Promise<Process> {
  return client.post<Process>(`${BASE}/${id}/processes`, input);
}

export async function getProcess(
  client: ApiClient,
  id: string,
  processId: string,
): Promise<Process> {
  return client.get<Process>(`${BASE}/${id}/processes/${processId}`);
}

export async function updateProcess(
  client: ApiClient,
  id: string,
  processId: string,
  input: UpdateProcessInput,
): Promise<Process> {
  return client.patch<Process>(`${BASE}/${id}/processes/${processId}`, input);
}

export async function deleteProcess(
  client: ApiClient,
  id: string,
  processId: string,
): Promise<void> {
  return client.delete(`${BASE}/${id}/processes/${processId}`);
}

export async function triggerCronJob(
  client: ApiClient,
  id: string,
  processId: string,
): Promise<void> {
  return client.post(`${BASE}/${id}/processes/${processId}/trigger`);
}

// ---------------------------------------------------------------------------
// Process metrics
// ---------------------------------------------------------------------------

export async function getProcessCpuUsage(
  client: ApiClient,
  id: string,
  processId: string,
  query: ProcessMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/processes/${processId}/metrics/cpu-usage`,
    query as unknown as QueryParams,
  );
}

export async function getProcessCpuLimit(
  client: ApiClient,
  id: string,
  processId: string,
  query: ProcessMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/processes/${processId}/metrics/cpu-limit`,
    query as unknown as QueryParams,
  );
}

export async function getProcessMemoryUsage(
  client: ApiClient,
  id: string,
  processId: string,
  query: ProcessMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/processes/${processId}/metrics/memory-usage`,
    query as unknown as QueryParams,
  );
}

export async function getProcessMemoryLimit(
  client: ApiClient,
  id: string,
  processId: string,
  query: ProcessMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/processes/${processId}/metrics/memory-limit`,
    query as unknown as QueryParams,
  );
}

export async function getProcessInstanceCount(
  client: ApiClient,
  id: string,
  processId: string,
  query: ProcessMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/processes/${processId}/metrics/instance-count`,
    query as unknown as QueryParams,
  );
}

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------

export async function listEnvVars(client: ApiClient, id: string): Promise<PaginatedList<EnvVar>> {
  return client.get<PaginatedList<EnvVar>>(`${BASE}/${id}/env-vars`);
}

export async function createEnvVar(
  client: ApiClient,
  id: string,
  input: CreateEnvVarInput,
): Promise<EnvVar> {
  return client.post<EnvVar>(`${BASE}/${id}/env-vars`, input);
}

export async function updateEnvVar(
  client: ApiClient,
  id: string,
  envVarId: string,
  input: UpdateEnvVarInput,
): Promise<EnvVar> {
  return client.put<EnvVar>(`${BASE}/${id}/env-vars/${envVarId}`, input);
}

export async function deleteEnvVar(client: ApiClient, id: string, envVarId: string): Promise<void> {
  return client.delete(`${BASE}/${id}/env-vars/${envVarId}`);
}

// ---------------------------------------------------------------------------
// Deployment hook
// ---------------------------------------------------------------------------

export async function getDeploymentHook(client: ApiClient, id: string): Promise<DeploymentHook> {
  return client.get<DeploymentHook>(`${BASE}/${id}/deployment-hook`);
}

export async function enableDeploymentHook(client: ApiClient, id: string): Promise<DeploymentHook> {
  return client.post<DeploymentHook>(`${BASE}/${id}/deployment-hook`);
}

export async function regenerateDeploymentHook(
  client: ApiClient,
  id: string,
): Promise<DeploymentHook> {
  return client.put<DeploymentHook>(`${BASE}/${id}/deployment-hook`);
}

export async function disableDeploymentHook(client: ApiClient, id: string): Promise<void> {
  return client.delete(`${BASE}/${id}/deployment-hook`);
}

// ---------------------------------------------------------------------------
// Domains
// ---------------------------------------------------------------------------

export async function listDomains(client: ApiClient, id: string): Promise<PaginatedList<Domain>> {
  return client.get<PaginatedList<Domain>>(`${BASE}/${id}/domains`);
}

export async function addDomain(
  client: ApiClient,
  id: string,
  input: AddDomainInput,
): Promise<Domain> {
  return client.post<Domain>(`${BASE}/${id}/domains`, input);
}

export async function getDomain(client: ApiClient, id: string, domainId: string): Promise<Domain> {
  return client.get<Domain>(`${BASE}/${id}/domains/${domainId}`);
}

export async function updateDomain(
  client: ApiClient,
  id: string,
  domainId: string,
  input: UpdateDomainInput,
): Promise<Domain> {
  return client.patch<Domain>(`${BASE}/${id}/domains/${domainId}`, input);
}

export async function deleteDomain(client: ApiClient, id: string, domainId: string): Promise<void> {
  return client.delete(`${BASE}/${id}/domains/${domainId}`);
}

export async function refreshDomainStatus(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`${BASE}/${id}/domains/${domainId}/refresh-status`);
}

export async function setDomainPrimary(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<void> {
  return client.post(`${BASE}/${id}/domains/${domainId}/set-primary`);
}

export async function toggleDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`${BASE}/${id}/domains/${domainId}/toggle`);
}

// ---------------------------------------------------------------------------
// Logs
// ---------------------------------------------------------------------------

export async function getRuntimeLogs(
  client: ApiClient,
  id: string,
  query?: LogsQuery,
): Promise<LogEntry[]> {
  return client.get<LogEntry[]>(`${BASE}/${id}/runtime-logs`, query as QueryParams);
}

export async function getAccessLogs(
  client: ApiClient,
  id: string,
  query?: LogsQuery,
): Promise<LogEntry[]> {
  return client.get<LogEntry[]>(`${BASE}/${id}/access-logs`, query as QueryParams);
}

// ---------------------------------------------------------------------------
// CDN
// ---------------------------------------------------------------------------

export async function toggleCdn(client: ApiClient, id: string): Promise<CdnStatus> {
  return client.post<CdnStatus>(`${BASE}/${id}/cdn/toggle`);
}

// ---------------------------------------------------------------------------
// IP restriction
// ---------------------------------------------------------------------------

export async function getIpRestriction(client: ApiClient, id: string): Promise<IpRestriction> {
  return client.get<IpRestriction>(`${BASE}/${id}/ip-restriction`);
}

export async function updateIpRestriction(
  client: ApiClient,
  id: string,
  input: UpdateIpRestrictionInput,
): Promise<IpRestriction> {
  return client.put<IpRestriction>(`${BASE}/${id}/ip-restriction`, input);
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

export async function purgeCache(client: ApiClient, id: string): Promise<void> {
  return client.post(`${BASE}/${id}/purge-cache`);
}

// ---------------------------------------------------------------------------
// TCP proxies
// ---------------------------------------------------------------------------

export async function listTcpProxies(
  client: ApiClient,
  id: string,
): Promise<PaginatedList<TcpProxy>> {
  return client.get<PaginatedList<TcpProxy>>(`${BASE}/${id}/tcp-proxies`);
}

export async function createTcpProxy(
  client: ApiClient,
  id: string,
  input: CreateTcpProxyInput,
): Promise<TcpProxy> {
  return client.post<TcpProxy>(`${BASE}/${id}/tcp-proxies`, input);
}

export async function deleteTcpProxy(
  client: ApiClient,
  id: string,
  tcpProxyId: string,
): Promise<void> {
  return client.delete(`${BASE}/${id}/tcp-proxies/${tcpProxyId}`);
}

// ---------------------------------------------------------------------------
// Private ports
// ---------------------------------------------------------------------------

export async function listPrivatePorts(
  client: ApiClient,
  id: string,
): Promise<PaginatedList<PrivatePort>> {
  return client.get<PaginatedList<PrivatePort>>(`${BASE}/${id}/private-ports`);
}

export async function createPrivatePort(
  client: ApiClient,
  id: string,
  input: CreatePrivatePortInput,
): Promise<PrivatePort> {
  return client.post<PrivatePort>(`${BASE}/${id}/private-ports`, input);
}

export async function deletePrivatePort(
  client: ApiClient,
  id: string,
  privatePortId: string,
): Promise<void> {
  return client.delete(`${BASE}/${id}/private-ports/${privatePortId}`);
}

// ---------------------------------------------------------------------------
// Application metrics
// ---------------------------------------------------------------------------

export async function getRequestsPerMinute(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/metrics/requests-per-minute`,
    query as unknown as QueryParams,
  );
}

export async function getResponseTime(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/metrics/response-time`,
    query as unknown as QueryParams,
  );
}

export async function getResponseTimeAvg(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<MetricPoint[]> {
  return client.get<MetricPoint[]>(
    `${BASE}/${id}/metrics/response-time-avg`,
    query as unknown as QueryParams,
  );
}

export async function getStatusCodes(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<StatusCodePoint[]> {
  return client.get<StatusCodePoint[]>(
    `${BASE}/${id}/metrics/status-codes`,
    query as unknown as QueryParams,
  );
}

export async function getTopStatusCodes(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<TopStatusCode[]> {
  return client.get<TopStatusCode[]>(
    `${BASE}/${id}/metrics/top-status-codes`,
    query as unknown as QueryParams,
  );
}

export async function getTopCountries(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<TopCountry[]> {
  return client.get<TopCountry[]>(
    `${BASE}/${id}/metrics/top-countries`,
    query as unknown as QueryParams,
  );
}

export async function getSlowestRequests(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<SlowestRequest[]> {
  return client.get<SlowestRequest[]>(
    `${BASE}/${id}/metrics/slowest-requests`,
    query as unknown as QueryParams,
  );
}

export async function getTopPages(
  client: ApiClient,
  id: string,
  query: AppMetricsQuery,
): Promise<TopPage[]> {
  return client.get<TopPage[]>(`${BASE}/${id}/metrics/top-pages`, query as unknown as QueryParams);
}
