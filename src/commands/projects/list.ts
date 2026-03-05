import { makeListCommand } from '../../helpers/command-factory.ts';

export const projectsListCommand = makeListCommand({
  name: 'list',
  description: 'List all projects',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Description', key: 'description' },
  ],
  apiCall: (client, opts) =>
    client.get('/projects', {
      page: opts['page'] as number,
      per_page: opts['perPage'] as number,
    }),
});
