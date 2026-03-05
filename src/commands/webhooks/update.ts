import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const webhooksUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a webhook',
  options: [
    { flags: '--endpoint <url>', description: 'Webhook endpoint URL' },
    {
      flags: '--events <events>',
      description: 'Comma-separated event types (e.g. APP_CREATE,APP_DEPLOY)',
    },
    { flags: '--description <text>', description: 'Webhook description' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Endpoint: item['endpoint'],
    Events: item['allowed_events'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['endpoint']) body['endpoint'] = opts['endpoint'];
    if (opts['events']) {
      body['allowed_events'] = (opts['events'] as string).split(',').map((e) => e.trim());
    }
    if (opts['description']) body['description'] = opts['description'];
    return client.patch(`/webhooks/${id}`, body);
  },
});
