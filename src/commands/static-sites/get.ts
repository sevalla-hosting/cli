import { makeGetCommand } from '../../helpers/command-factory.ts';

export const staticSitesGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get static site details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'] ?? item['name'],
    Status: item['status'],
    Region: item['region'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/static-sites/${id}`),
});
