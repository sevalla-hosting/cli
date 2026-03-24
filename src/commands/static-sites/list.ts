import { makeListCommand } from '../../helpers/command-factory.ts';

export const staticSitesListCommand = makeListCommand({
  name: 'list',
  description: 'List all static sites',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client) => client.get('/static-sites'),
});
