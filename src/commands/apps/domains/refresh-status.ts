import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsRefreshStatusCommand = makeSubResourceActionCommand({
  name: 'refresh-status',
  description: 'Refresh domain status',
  parentIdName: 'app-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/applications/${parentId}/domains/${childId}/refresh-status`),
  successMessage: 'Domain status refreshed.',
});
