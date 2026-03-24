import { makeListCommand } from '../../../helpers/command-factory.ts';

export const deploymentsListCommand = makeListCommand({
  name: 'list',
  description: 'List deployments for a static site',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Status', key: 'status' },
    { header: 'Created At', key: 'created_at' },
  ],
  apiCall: (client, opts) => client.get(`/static-sites/${opts['siteId']}/deployments`),
  parentIdFlag: { name: 'site-id', description: 'Static site ID' },
});
