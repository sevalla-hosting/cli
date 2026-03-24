import { makeListCommand } from '../../helpers/command-factory.ts';

export const databasesListCommand = makeListCommand({
  name: 'list',
  description: 'List all databases',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Type', key: 'type' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client) => client.get('/databases'),
});
