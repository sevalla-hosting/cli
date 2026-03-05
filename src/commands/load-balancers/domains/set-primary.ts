import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsSetPrimaryCommand = makeSubResourceActionCommand({
  name: 'set-primary',
  description: 'Set primary domain',
  parentIdName: 'lb-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/load-balancers/${parentId}/domains/${childId}/set-primary`),
  successMessage: 'Primary domain set.',
});
