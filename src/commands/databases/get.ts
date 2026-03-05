import { makeGetCommand } from '../../helpers/command-factory.ts';

export const databasesGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get database details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'] ?? item['name'],
    Type: item['type'],
    Status: item['status'],
    Region: item['region'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/databases/${id}`),
});
