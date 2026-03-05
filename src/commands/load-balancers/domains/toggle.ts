import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const domainsToggleCommand = makeSubResourceActionCommand({
  name: 'toggle',
  description: 'Toggle system domain',
  parentIdName: 'lb-id',
  childIdName: 'domain-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/load-balancers/${parentId}/domains/${childId}/toggle`),
  successMessage: 'Domain toggled.',
});
