import { makeListCommand } from '../../../helpers/command-factory.ts';

export const privatePortsListCommand = makeListCommand({
  name: 'list',
  description: 'List private ports',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Port', key: 'port' },
    { header: 'Protocol', key: 'protocol' },
  ],
  apiCall: (client, opts) => client.get(`/applications/${opts['appId']}/private-ports`),
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
});
