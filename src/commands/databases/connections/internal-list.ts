import { makeListCommand } from '../../../helpers/command-factory.ts';

export const internalConnectionsListCommand = makeListCommand({
  name: 'internal-list',
  description: 'List internal database connections',
  parentIdFlag: { name: 'db-id', description: 'Database ID' },
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Application', key: 'application' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client, opts) => client.get(`/databases/${opts['dbId']}/internal-connections`),
});
