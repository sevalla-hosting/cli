import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const destinationsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a load balancer destination',
  parentIdName: 'lb-id',
  childIdName: 'destination-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/load-balancers/${parentId}/destinations/${childId}`),
  successMessage: 'Destination deleted.',
});
