import { makeListCommand } from '../../helpers/command-factory.ts';

export const resourcesRbacPermissionsCommand = makeListCommand({
  name: 'rbac-permissions',
  description: 'List available API key permissions',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Resource', key: 'resource' },
    { header: 'Action', key: 'action' },
    { header: 'Description', key: 'description' },
  ],
  apiCall: (client) => client.get('/resources/rbac/api-key-permissions'),
});
