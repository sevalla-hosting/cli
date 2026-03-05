import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const destinationsToggleCommand = makeSubResourceActionCommand({
  name: 'toggle',
  description: 'Toggle a load balancer destination',
  parentIdName: 'lb-id',
  childIdName: 'destination-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/load-balancers/${parentId}/destinations/${childId}/toggle`),
  successMessage: 'Destination toggled.',
});
