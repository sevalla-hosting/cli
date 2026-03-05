import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const databasesDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a database',
  apiCall: (client, id) => client.delete(`/databases/${id}`),
  successMessage: 'Database deleted.',
});
