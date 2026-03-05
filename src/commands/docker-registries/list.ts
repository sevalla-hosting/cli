import { makeListCommand } from '../../helpers/command-factory.ts';

export const dockerRegistriesListCommand = makeListCommand({
  name: 'list',
  description: 'List all Docker registries',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'URL', key: 'url' },
  ],
  apiCall: (client, opts) =>
    client.get('/docker-registries', {
      page: opts['page'] as number,
      per_page: opts['perPage'] as number,
    }),
});
