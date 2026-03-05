import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const internalConnectionsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'internal-delete',
  description: 'Delete an internal database connection',
  parentIdName: 'db-id',
  childIdName: 'connection-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/databases/${parentId}/internal-connections/${childId}`),
  successMessage: 'Internal connection deleted.',
});
