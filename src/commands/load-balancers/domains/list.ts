import { makeListCommand } from '../../../helpers/command-factory.ts';

export const domainsListCommand = makeListCommand({
  name: 'list',
  description: 'List load balancer domains',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Status', key: 'status' },
    { header: 'Primary', key: 'is_primary' },
  ],
  apiCall: (client, opts) => client.get(`/load-balancers/${opts['lbId']}/domains`),
  parentIdFlag: { name: 'lb-id', description: 'Load balancer ID' },
});
