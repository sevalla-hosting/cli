import { makeGetCommand } from '../../helpers/command-factory.ts';

export const appsGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get application details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'] ?? item['name'],
    Status: item['status'],
    Source: item['source'],
    Type: item['type'],
    'Build Type': item['build_type'],
    Suspended: item['is_suspended'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/applications/${id}`),
});
