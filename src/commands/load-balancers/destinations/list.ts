import { makeListCommand } from '../../../helpers/command-factory.ts';

export const destinationsListCommand = makeListCommand({
  name: 'list',
  description: 'List load balancer destinations',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Application ID', key: 'application_id' },
    { header: 'Port', key: 'port' },
    { header: 'Enabled', key: 'enabled' },
  ],
  apiCall: (client, opts) => client.get(`/load-balancers/${opts['lbId']}/destinations`),
  parentIdFlag: { name: 'lb-id', description: 'Load balancer ID' },
});
