import { makeListCommand } from '../../../helpers/command-factory.ts';

export const envVarsListCommand = makeListCommand({
  name: 'list',
  description: 'List environment variables',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Key', key: 'key' },
    { header: 'Value', key: 'value' },
  ],
  apiCall: (client, opts) => client.get(`/static-sites/${opts['siteId']}/env-vars`),
  parentIdFlag: { name: 'site-id', description: 'Static site ID' },
});
