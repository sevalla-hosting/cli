import { makeListCommand } from '../../../helpers/command-factory.ts';

export const dockerfilesListCommand = makeListCommand({
  name: 'list',
  description: 'List the Dockerfile versions an application was built from, newest first',
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Version', key: 'version' },
    { header: 'Source', key: 'source' },
    { header: 'Language', key: 'language' },
    { header: 'Ingot Version', key: 'ingot_version' },
    { header: 'Created At', key: 'created_at' },
  ],
  apiCall: (client, opts) => client.get(`/applications/${opts['appId']}/dockerfiles`),
});
