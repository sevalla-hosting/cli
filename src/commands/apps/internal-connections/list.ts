import { makeListCommand } from '../../../helpers/command-factory.ts';

export const internalConnectionsListCommand = makeListCommand({
  name: 'list',
  description: 'List the internal connections of an application, in either direction',
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Source', key: 'source_display_name' },
    { header: 'Target', key: 'target_display_name' },
    { header: 'Target Type', key: 'target_type' },
  ],
  apiCall: (client, opts) => client.get(`/applications/${opts['appId']}/internal-connections`),
  paginated: false,
});
