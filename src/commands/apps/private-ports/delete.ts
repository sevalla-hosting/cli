import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const privatePortsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a private port',
  parentIdName: 'app-id',
  childIdName: 'private-port-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/applications/${parentId}/private-ports/${childId}`),
  successMessage: 'Private port deleted.',
});
