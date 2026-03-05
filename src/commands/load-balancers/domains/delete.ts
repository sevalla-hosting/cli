import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const domainsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a load balancer domain',
  parentIdName: 'lb-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/load-balancers/${parentId}/domains/${childId}`),
  successMessage: 'Domain deleted.',
});
