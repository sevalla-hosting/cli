import { makeListCommand } from '../../helpers/command-factory.ts';

export const resourcesClustersCommand = makeListCommand({
  name: 'clusters',
  description: 'List available clusters',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Location', key: 'location' },
  ],
  apiCall: (client) => client.get('/resources/clusters'),
});
