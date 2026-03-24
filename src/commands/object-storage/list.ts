import { makeListCommand } from '../../helpers/command-factory.ts';

export const objectStorageListCommand = makeListCommand({
  name: 'list',
  description: 'List all object storage buckets',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client) => client.get('/object-storage'),
});
