import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsSetPrimaryCommand = makeSubResourceActionCommand({
  name: 'set-primary',
  description: 'Set primary domain',
  parentIdName: 'site-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/static-sites/${parentId}/domains/${childId}/set-primary`),
  successMessage: 'Primary domain set.',
});
