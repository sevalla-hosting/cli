import { makeListCommand } from '../../helpers/command-factory.ts';

export const globalEnvVarsListCommand = makeListCommand({
  name: 'list',
  description: 'List all global environment variables',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Key', key: 'key' },
    { header: 'Value', key: 'value' },
  ],
  apiCall: (client) => client.get('/applications/global-env-vars'),
});
