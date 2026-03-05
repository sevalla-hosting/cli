import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const loadBalancersDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a load balancer',
  apiCall: (client, id) => client.delete(`/load-balancers/${id}`),
  successMessage: 'Load balancer deleted.',
});
