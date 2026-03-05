import { makeActionCommand } from '../../helpers/command-factory.ts';

export const apiKeysToggleCommand = makeActionCommand({
  name: 'toggle',
  description: 'Toggle an API key',
  apiCall: (client, id) => client.post(`/api-keys/${id}/toggle`),
  successMessage: 'API key toggled.',
});
