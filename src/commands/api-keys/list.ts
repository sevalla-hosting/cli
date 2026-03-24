import { makeListCommand } from '../../helpers/command-factory.ts';

export const apiKeysListCommand = makeListCommand({
  name: 'list',
  description: 'List all API keys',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Enabled', key: 'enabled' },
    { header: 'Expires At', key: 'expires_at' },
  ],
  apiCall: (client) => client.get('/api-keys'),
});
