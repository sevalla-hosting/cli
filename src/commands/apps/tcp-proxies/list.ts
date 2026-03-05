import { makeListCommand } from '../../../helpers/command-factory.ts';

export const tcpProxiesListCommand = makeListCommand({
  name: 'list',
  description: 'List TCP proxies',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Port', key: 'port' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client, opts) => client.get(`/applications/${opts['appId']}/tcp-proxies`),
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
});
