import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsRefreshStatusCommand = makeSubResourceActionCommand({
  name: 'refresh-status',
  description: 'Refresh domain status',
  parentIdName: 'site-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/static-sites/${parentId}/domains/${childId}/refresh-status`),
  successMessage: 'Domain status refreshed.',
});
