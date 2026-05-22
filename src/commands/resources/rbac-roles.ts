import { makeListCommand } from '../../helpers/command-factory.ts';

export const resourcesRbacRolesCommand = makeListCommand({
  name: 'rbac-roles',
  description: 'List available API key roles',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Description', key: 'description' },
  ],
  apiCall: (client) => client.get('/resources/rbac/api-key-roles'),
});
