import { makeActionCommand } from '../../helpers/command-factory.ts';

export const webhooksToggleCommand = makeActionCommand({
  name: 'toggle',
  description: 'Toggle a webhook',
  apiCall: (client, id) => client.post(`/webhooks/${id}/toggle`),
  successMessage: 'Webhook toggled.',
});
