import { makeListCommand } from '../../helpers/command-factory.ts';

export const loadBalancersListCommand = makeListCommand({
  name: 'list',
  description: 'List all load balancers',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client) => client.get('/load-balancers'),
});
