import { makeListCommand } from '../../../helpers/command-factory.ts';
import type { QueryParams } from '../../../client/types.ts';

export const externalBackupsListCommand = makeListCommand({
  name: 'list',
  description: 'List the dump backups in the backup target buckets',
  parentIdFlag: { name: 'db-id', description: 'Database ID' },
  options: [
    { flags: '--type <type>', description: 'Only backups of this type: automatic or manual' },
  ],
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Type', key: 'type' },
    { header: 'Size (bytes)', key: 'size_bytes' },
    { header: 'Created At', key: 'created_at' },
    { header: 'Expires At', key: 'expires_at' },
  ],
  apiCall: (client, opts) =>
    client.get(`/databases/${opts['dbId']}/external-backups`, {
      type: opts['type'],
    } as QueryParams),
  paginated: false,
});
