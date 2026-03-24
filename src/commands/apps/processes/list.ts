import { makeListCommand } from '../../../helpers/command-factory.ts';

export const processesListCommand = makeListCommand({
  name: 'list',
  description: 'List processes for an application',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Key', key: 'key' },
    { header: 'Entrypoint', key: 'entrypoint' },
    { header: 'Internal Hostname', key: 'internal_hostname' },
    {
      header: 'Scaling Strategy',
      key: 'scaling_strategy',
      get: (row: Record<string, unknown>): string => {
        const s = row['scaling_strategy'] as Record<string, unknown> | null;
        return s ? String(s['type'] ?? JSON.stringify(s)) : '';
      },
    },
    { header: 'Resource Size', key: 'resource_type_name' },
  ],
  apiCall: (client, opts) =>
    client.get(`/applications/${opts['appId']}/processes`),
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
});
