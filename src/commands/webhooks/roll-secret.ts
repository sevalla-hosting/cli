import { makeActionCommand } from '../../helpers/command-factory.ts';

export const webhooksRollSecretCommand = makeActionCommand({
  name: 'roll-secret',
  description: 'Roll webhook secret',
  options: [
    {
      flags: '--expire-in-hours <hours>',
      description: 'Hours before old secret expires (default: 0)',
    },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/webhooks/${id}/roll-secret`, {
      expire_in_hours: opts['expireInHours'] ? Number(opts['expireInHours']) : 0,
    }),
  successMessage: 'Webhook secret rolled.',
});
