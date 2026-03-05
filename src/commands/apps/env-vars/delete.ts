import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const envVarsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete an environment variable',
  parentIdName: 'app-id',
  childIdName: 'env-var-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/applications/${parentId}/env-vars/${childId}`),
  successMessage: 'Environment variable deleted.',
});
