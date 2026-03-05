import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const domainsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete an application domain',
  parentIdName: 'app-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/applications/${parentId}/domains/${childId}`),
  successMessage: 'Domain deleted.',
});
