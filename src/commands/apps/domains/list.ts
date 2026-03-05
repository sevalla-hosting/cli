import { makeListCommand } from '../../../helpers/command-factory.ts';

export const domainsListCommand = makeListCommand({
  name: 'list',
  description: 'List application domains',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Status', key: 'status' },
    { header: 'Primary', key: 'is_primary' },
  ],
  apiCall: (client, opts) => client.get(`/applications/${opts['appId']}/domains`),
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
});
