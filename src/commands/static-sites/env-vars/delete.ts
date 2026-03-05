import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const envVarsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete an environment variable',
  parentIdName: 'site-id',
  childIdName: 'env-var-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/static-sites/${parentId}/env-vars/${childId}`),
  successMessage: 'Environment variable deleted.',
});
