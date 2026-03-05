import { makeListCommand } from '../../../helpers/command-factory.ts';

export const deliveriesListCommand = makeListCommand({
  name: 'list',
  description: 'List webhook deliveries',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Event', key: 'event' },
    { header: 'Status', key: 'status' },
    { header: 'Created At', key: 'created_at' },
  ],
  apiCall: (client, opts) => client.get(`/webhooks/${opts['webhookId']}/deliveries`),
  parentIdFlag: { name: 'webhook-id', description: 'Webhook ID' },
});
