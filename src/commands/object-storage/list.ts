import { makeListCommand } from '../../helpers/command-factory.ts';

export const objectStorageListCommand = makeListCommand({
  name: 'list',
  description: 'List all object storage buckets',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client, opts) =>
    client.get('/object-storage', {
      page: opts['page'] as number,
      per_page: opts['perPage'] as number,
    }),
});
