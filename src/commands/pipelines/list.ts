import { makeListCommand } from '../../helpers/command-factory.ts';

export const pipelinesListCommand = makeListCommand({
  name: 'list',
  description: 'List all pipelines',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Status', key: 'status' },
  ],
  apiCall: (client, opts) =>
    client.get('/pipelines', {
      page: opts['page'] as number,
      per_page: opts['perPage'] as number,
    }),
});
