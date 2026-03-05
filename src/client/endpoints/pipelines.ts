import type { ApiClient } from '../api-client.ts';
import type { PaginatedResponse, PaginationQuery, QueryParams } from '../types.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Pipeline {
  id: string;
  name: string;
  display_name: string;
  type: string;
  status: string | null;
  project_id?: string | null;
  stages?: PipelineStage[];
  preview?: PipelinePreview | null;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: string;
  display_name: string;
  order: number;
  branch?: string | null;
  apps?: StageApp[];
}

export interface StageApp {
  id: string;
  name: string;
  display_name: string;
}

export interface PipelinePreview {
  is_enabled: boolean;
  repo_url?: string;
  auto_create_app: boolean;
  delete_stale_apps: boolean;
  stale_app_days: number;
}

export interface CreatePipelineBody {
  display_name: string;
  type: string;
  project_id?: string;
}

export interface UpdatePipelineBody {
  display_name?: string;
  type?: string;
  stage_order?: Array<{ stage_id: string; order: number }>;
  project_id?: string | null;
}

export interface PromotePipelineBody {
  source_app_id: string;
  target_app_ids: string[];
}

export interface CreateStageBody {
  display_name: string;
  insert_before: number;
  branch?: string | null;
}

export interface AddStageAppBody {
  app_id: string;
}

export interface EnablePreviewBody {
  repo_url?: string;
  auto_create_app?: boolean;
  delete_stale_apps?: boolean;
  stale_app_days?: number;
}

export interface UpdatePreviewBody {
  repo_url?: string;
  auto_create_app?: boolean;
  delete_stale_apps?: boolean;
  stale_app_days?: number;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listPipelines(
  client: ApiClient,
  query?: PaginationQuery,
): Promise<PaginatedResponse<Pipeline>> {
  return client.get<PaginatedResponse<Pipeline>>('/pipelines', query as QueryParams);
}

export async function createPipeline(
  client: ApiClient,
  body: CreatePipelineBody,
): Promise<Pipeline> {
  return client.post<Pipeline>('/pipelines', body);
}

export async function getPipeline(client: ApiClient, id: string): Promise<Pipeline> {
  return client.get<Pipeline>(`/pipelines/${id}`);
}

export async function updatePipeline(
  client: ApiClient,
  id: string,
  body: UpdatePipelineBody,
): Promise<Pipeline> {
  return client.patch<Pipeline>(`/pipelines/${id}`, body);
}

export async function deletePipeline(client: ApiClient, id: string): Promise<void> {
  return client.delete<undefined>(`/pipelines/${id}`);
}

// ---------------------------------------------------------------------------
// Promote
// ---------------------------------------------------------------------------

export async function promotePipeline(
  client: ApiClient,
  id: string,
  body: PromotePipelineBody,
): Promise<Pipeline> {
  return client.post<Pipeline>(`/pipelines/${id}/promote`, body);
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

export async function createPipelineStage(
  client: ApiClient,
  id: string,
  body: CreateStageBody,
): Promise<PipelineStage> {
  return client.post<PipelineStage>(`/pipelines/${id}/stages`, body);
}

export async function deletePipelineStage(
  client: ApiClient,
  id: string,
  stageId: string,
): Promise<void> {
  return client.delete<undefined>(`/pipelines/${id}/stages/${stageId}`);
}

// ---------------------------------------------------------------------------
// Stage Apps
// ---------------------------------------------------------------------------

export async function addStageApp(
  client: ApiClient,
  id: string,
  stageId: string,
  body: AddStageAppBody,
): Promise<StageApp> {
  return client.post<StageApp>(`/pipelines/${id}/stages/${stageId}/apps`, body);
}

export async function removeStageApp(
  client: ApiClient,
  id: string,
  stageId: string,
  appId: string,
): Promise<void> {
  return client.delete<undefined>(`/pipelines/${id}/stages/${stageId}/apps/${appId}`);
}

// ---------------------------------------------------------------------------
// Preview
// ---------------------------------------------------------------------------

export async function enablePipelinePreview(
  client: ApiClient,
  id: string,
  body: EnablePreviewBody,
): Promise<Pipeline> {
  return client.post<Pipeline>(`/pipelines/${id}/preview/enable`, body);
}

export async function disablePipelinePreview(client: ApiClient, id: string): Promise<Pipeline> {
  return client.post<Pipeline>(`/pipelines/${id}/preview/disable`);
}

export async function updatePipelinePreview(
  client: ApiClient,
  id: string,
  body: UpdatePreviewBody,
): Promise<Pipeline> {
  return client.put<Pipeline>(`/pipelines/${id}/preview`, body);
}
