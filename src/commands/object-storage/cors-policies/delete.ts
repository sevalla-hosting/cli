import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const corsPoliciesDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a CORS policy',
  parentIdName: 'bucket-id',
  childIdName: 'policy-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/object-storage/${parentId}/cors-policies/${childId}`),
  successMessage: 'CORS policy deleted.',
});
