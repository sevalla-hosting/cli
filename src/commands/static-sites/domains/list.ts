import { makeListCommand } from '../../../helpers/command-factory.ts';

export const domainsListCommand = makeListCommand({
  name: 'list',
  description: 'List static site domains',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Status', key: 'status' },
    { header: 'Primary', key: 'is_primary' },
  ],
  apiCall: (client, opts) => client.get(`/static-sites/${opts['siteId']}/domains`),
  parentIdFlag: { name: 'site-id', description: 'Static site ID' },
});
