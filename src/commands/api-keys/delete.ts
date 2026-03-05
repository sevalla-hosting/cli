import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const apiKeysDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete an API key',
  apiCall: (client, id) => client.delete(`/api-keys/${id}`),
  successMessage: 'API key deleted.',
});
