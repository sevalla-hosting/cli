import { makeGetCommand } from '../../helpers/command-factory.ts';

export const apiKeysGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get API key details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
    Enabled: item['enabled'],
    'Expires At': item['expires_at'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/api-keys/${id}`),
});
