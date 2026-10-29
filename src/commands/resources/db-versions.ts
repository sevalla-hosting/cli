import { makeListCommand } from '../../helpers/command-factory.ts';
import type { QueryParams } from '../../client/types.ts';

export const resourcesDbVersionsCommand = makeListCommand<{ type: string; versions: string[] }>({
  name: 'db-versions',
  description: 'List the database versions you can create on a cluster',
  options: [
    { flags: '--cluster <id>', description: 'Cluster ID', required: true },
    {
      flags: '--type <type>',
      description: 'Only this database type: postgresql, mariadb, mysql, redis or valkey',
    },
  ],
  columns: [
    { header: 'Type', key: 'type' },
    { header: 'Versions', get: (item) => item.versions.join(', ') },
  ],
  apiCall: (client, opts) =>
    client.get('/resources/database-versions', {
      cluster_id: opts['cluster'],
      type: opts['type'],
    } as QueryParams),
  paginated: false,
});
