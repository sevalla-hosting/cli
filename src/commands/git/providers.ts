import { makeListCommand } from '../../helpers/command-factory.ts';

export const gitProvidersCommand = makeListCommand({
  name: 'providers',
  description: 'List git providers',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Type', key: 'type' },
  ],
  apiCall: (client) => client.get('/git/providers'),
});
