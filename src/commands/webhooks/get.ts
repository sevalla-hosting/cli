import { makeGetCommand } from '../../helpers/command-factory.ts';

export const webhooksGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get webhook details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    URL: item['url'],
    Events: item['events'],
    Enabled: item['enabled'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/webhooks/${id}`),
});
