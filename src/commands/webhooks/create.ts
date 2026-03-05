import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const webhooksCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new webhook',
  options: [
    { flags: '--endpoint <url>', description: 'Webhook endpoint URL', required: true },
    {
      flags: '--events <events>',
      description: 'Comma-separated event types (e.g. APP_CREATE,APP_DEPLOY)',
      required: true,
    },
    { flags: '--description <text>', description: 'Webhook description' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Endpoint: item['endpoint'],
    Events: item['allowed_events'],
  }),
  apiCall: (client, opts) => {
    const events = (opts['events'] as string).split(',').map((e) => e.trim());
    const body: Record<string, unknown> = {
      endpoint: opts['endpoint'],
      allowed_events: events,
    };
    if (opts['description']) body['description'] = opts['description'];
    return client.post('/webhooks', body);
  },
  successMessage: 'Webhook created successfully.',
});
