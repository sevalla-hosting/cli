import { makeListCommand } from '../../helpers/command-factory.ts';

export const webhooksListCommand = makeListCommand({
  name: 'list',
  description: 'List all webhooks',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'URL', key: 'url' },
    { header: 'Events', key: 'events' },
    { header: 'Enabled', key: 'enabled' },
  ],
  apiCall: (client) => client.get('/webhooks'),
});
