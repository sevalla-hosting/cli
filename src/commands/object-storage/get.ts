import { makeGetCommand } from '../../helpers/command-factory.ts';

export const objectStorageGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get object storage bucket details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'] ?? item['name'],
    Status: item['status'],
    Region: item['region'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/object-storage/${id}`),
});
