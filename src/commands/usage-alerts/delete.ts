import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const usageAlertsDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a usage alert config',
  apiCall: (client, id) => client.delete(`/usage-alerts/${id}`),
  successMessage: 'Usage alert deleted.',
});
