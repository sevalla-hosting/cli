import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const domainsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a static site domain',
  parentIdName: 'site-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/static-sites/${parentId}/domains/${childId}`),
  successMessage: 'Domain deleted.',
});
