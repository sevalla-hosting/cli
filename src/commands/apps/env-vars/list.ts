import { makeListCommand } from '../../../helpers/command-factory.ts';

export const envVarsListCommand = makeListCommand({
  name: 'list',
  description: 'List environment variables',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Key', key: 'key' },
    { header: 'Value', key: 'value' },
  ],
  apiCall: (client, opts) => client.get(`/applications/${opts['appId']}/env-vars`),
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
});
