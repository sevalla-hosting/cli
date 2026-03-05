import { makeListCommand } from '../../helpers/command-factory.ts';

export const resourcesDbTypesCommand = makeListCommand({
  name: 'db-types',
  description: 'List available database resource types',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
  ],
  apiCall: (client) => client.get('/resources/database-resource-types'),
});
