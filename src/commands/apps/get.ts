import { makeGetCommand } from '../../helpers/command-factory.ts';
import type { PaginatedResponse } from '../../client/types.ts';

type Item = Record<string, unknown>;

export const appsGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get application details',
  displayFields: (item: Item) => ({
    ID: item['id'],
    Name: item['display_name'] ?? item['name'],
    Status: item['status'],
    Source: item['source'],
    Type: item['type'],
    'Build Type': item['build_type'],
    Suspended: item['is_suspended'],
    CDN: item['is_cdn_enabled'],
    'Edge Cache': item['is_edge_cache_enabled'],
    'Primary Domain': item['primary_domain'],
    'Created At': item['created_at'],
  }),
  // The application resource has no address, so the primary domain comes from its domain list
  apiCall: async (client, id) => {
    const [app, domains] = await Promise.all([
      client.get<Item>(`/applications/${id}`),
      client.get<PaginatedResponse<Item>>(`/applications/${id}/domains`, { limit: 100 }),
    ]);
    const primary =
      domains.data.find((d) => d['is_primary']) ??
      domains.data.find((d) => d['type'] === 'SYSTEM' && d['is_enabled']);
    return { ...app, primary_domain: primary?.['name'] ?? null };
  },
});
