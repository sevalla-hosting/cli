import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsToggleCommand = makeSubResourceActionCommand({
  name: 'toggle',
  description: 'Toggle system domain',
  parentIdName: 'app-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/applications/${parentId}/domains/${childId}/toggle`),
  successMessage: 'Domain toggled.',
});
