import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const webhooksDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a webhook',
  apiCall: (client, id) => client.delete(`/webhooks/${id}`),
  successMessage: 'Webhook deleted.',
});
