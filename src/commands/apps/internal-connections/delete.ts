import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const internalConnectionsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete an internal connection of an application',
  parentIdName: 'app-id',
  childIdName: 'connection-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/applications/${parentId}/internal-connections/${childId}`),
  successMessage: 'Internal connection deleted.',
});
