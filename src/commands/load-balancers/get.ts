import { makeGetCommand } from '../../helpers/command-factory.ts';

export const loadBalancersGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get load balancer details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'] ?? item['name'],
    Status: item['status'],
    Algorithm: item['algorithm'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/load-balancers/${id}`),
});
