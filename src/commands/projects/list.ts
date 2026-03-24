import { makeListCommand } from '../../helpers/command-factory.ts';

export const projectsListCommand = makeListCommand({
  name: 'list',
  description: 'List all projects',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Description', key: 'description' },
  ],
  apiCall: (client) => client.get('/projects'),
});
