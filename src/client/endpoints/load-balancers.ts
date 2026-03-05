import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoadBalancer {
  id: string;
  name: string;
  display_name: string;
  status: string | null;
  type: string;
  project_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLoadBalancerBody {
  display_name: string;
  type?: string;
  project_id?: string | null;
}

export interface UpdateLoadBalancerBody {
  display_name?: string;
  type?: string;
  project_id?: string | null;
}

export interface Destination {
  id: string;
  service_id?: string;
  service_type: string;
  weight?: number;
  url?: string;
  latitude?: number;
  longitude?: number;
  is_enabled: boolean;
  created_at: string;
}

export interface CreateDestinationBody {
  service_type: string;
  service_id?: string;
  weight?: number;
  url?: string;
  latitude?: number;
  longitude?: number;
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

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listLoadBalancers(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<LoadBalancer>> {
  return client.get<PaginatedResponse<LoadBalancer>>('/load-balancers', query as QueryParams);
}

export async function createLoadBalancer(
  client: ApiClient,
  body: CreateLoadBalancerBody,
): Promise<LoadBalancer> {
  return client.post<LoadBalancer>('/load-balancers', body);
}

export async function getLoadBalancer(client: ApiClient, id: string): Promise<LoadBalancer> {
  return client.get<LoadBalancer>(`/load-balancers/${id}`);
}

export async function updateLoadBalancer(
  client: ApiClient,
  id: string,
  body: UpdateLoadBalancerBody,
): Promise<LoadBalancer> {
  return client.patch<LoadBalancer>(`/load-balancers/${id}`, body);
}

export async function deleteLoadBalancer(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/load-balancers/${id}`);
}

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------

export async function listLoadBalancerDestinations(
  client: ApiClient,
  id: string,
): Promise<Destination[]> {
  return client.get<Destination[]>(`/load-balancers/${id}/destinations`);
}

export async function createLoadBalancerDestination(
  client: ApiClient,
  id: string,
  body: CreateDestinationBody,
): Promise<Destination> {
  return client.post<Destination>(`/load-balancers/${id}/destinations`, body);
}

export async function deleteLoadBalancerDestination(
  client: ApiClient,
  id: string,
  destinationId: string,
): Promise<void> {
  return client.delete<undefined>(`/load-balancers/${id}/destinations/${destinationId}`);
}

export async function toggleLoadBalancerDestination(
  client: ApiClient,
  id: string,
  destinationId: string,
): Promise<Destination> {
  return client.post<Destination>(`/load-balancers/${id}/destinations/${destinationId}/toggle`);
}

// ---------------------------------------------------------------------------
// Domains
// ---------------------------------------------------------------------------

export async function listLoadBalancerDomains(
  client: ApiClient,
  id: string,
  query?: PaginationQuery,
): Promise<PaginatedResponse<Domain>> {
  return client.get<PaginatedResponse<Domain>>(
    `/load-balancers/${id}/domains`,
    query as QueryParams,
  );
}

export async function addLoadBalancerDomain(
  client: ApiClient,
  id: string,
  body: AddDomainBody,
): Promise<Domain> {
  return client.post<Domain>(`/load-balancers/${id}/domains`, body);
}

export async function getLoadBalancerDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.get<Domain>(`/load-balancers/${id}/domains/${domainId}`);
}

export async function updateLoadBalancerDomain(
  client: ApiClient,
  id: string,
  domainId: string,
  body: UpdateDomainBody,
): Promise<Domain> {
  return client.patch<Domain>(`/load-balancers/${id}/domains/${domainId}`, body);
}

export async function deleteLoadBalancerDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<void> {
  return client.delete<undefined>(`/load-balancers/${id}/domains/${domainId}`);
}

export async function refreshLoadBalancerDomainStatus(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`/load-balancers/${id}/domains/${domainId}/refresh-status`);
}

export async function setLoadBalancerPrimaryDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`/load-balancers/${id}/domains/${domainId}/set-primary`);
}

export async function toggleLoadBalancerDomain(
  client: ApiClient,
  id: string,
  domainId: string,
): Promise<Domain> {
  return client.post<Domain>(`/load-balancers/${id}/domains/${domainId}/toggle`);
}
