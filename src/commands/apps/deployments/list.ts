import { makeListCommand } from '../../../helpers/command-factory.ts';

export const deploymentsListCommand = makeListCommand({
  name: 'list',
  description: 'List deployments for an application',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Status', key: 'status' },
    { header: 'Created At', key: 'created_at' },
  ],
  apiCall: (client, opts) => client.get(`/applications/${opts['appId']}/deployments`),
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
});
