import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsToggleCommand = makeSubResourceActionCommand({
  name: 'toggle',
  description: 'Toggle system domain',
  parentIdName: 'site-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/static-sites/${parentId}/domains/${childId}/toggle`),
  successMessage: 'Domain toggled.',
});
