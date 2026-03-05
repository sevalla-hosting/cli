import { makeListCommand } from '../../helpers/command-factory.ts';

export const resourcesProcessTypesCommand = makeListCommand({
  name: 'process-types',
  description: 'List available process resource types',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
  ],
  apiCall: (client) => client.get('/resources/process-resource-types'),
});
