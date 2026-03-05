import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsRefreshStatusCommand = makeSubResourceActionCommand({
  name: 'refresh-status',
  description: 'Refresh domain status',
  parentIdName: 'lb-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/load-balancers/${parentId}/domains/${childId}/refresh-status`),
  successMessage: 'Domain status refreshed.',
});
