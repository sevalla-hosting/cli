import { makeListCommand } from '../../helpers/command-factory.ts';
import type { QueryParams } from '../../client/types.ts';

export const projectsListCommand = makeListCommand({
  name: 'list',
  description: 'List all projects',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Description', key: 'description' },
  ],
  options: [
    { flags: '--search <text>', description: 'Only projects whose name contains this text' },
  ],
  apiCall: (client, opts) => client.get('/projects', { search: opts['search'] } as QueryParams),
});
