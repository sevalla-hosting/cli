import { makeListCommand } from '../../helpers/command-factory.ts';

export const usersListCommand = makeListCommand({
  name: 'list',
  description: 'List all users',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Email', key: 'email' },
    { header: 'Name', key: 'name' },
    { header: 'Role', key: 'role' },
  ],
  apiCall: (client) => client.get('/users'),
});
