import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const globalEnvVarsDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a global environment variable',
  apiCall: (client, id) => client.delete(`/applications/global-env-vars/${id}`),
  successMessage: 'Global environment variable deleted.',
});
