import { makeListCommand } from '../../helpers/command-factory.ts';

export const appsListCommand = makeListCommand({
  name: 'list',
  description: 'List all applications',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client) => client.get('/applications'),
});
