import { makeActionCommand } from '../../helpers/command-factory.ts';

export const webhooksRollSecretCommand = makeActionCommand({
  name: 'roll-secret',
  description: 'Roll webhook secret',
  confirm:
    'Rolling invalidates the current signing secret (immediately, or after --expire-in-hours).',
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
