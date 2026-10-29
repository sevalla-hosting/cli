import { makeListCommand } from '../../../helpers/command-factory.ts';

export const backupsListCommand = makeListCommand({
  name: 'list',
  description: 'List database backups',
  parentIdFlag: { name: 'db-id', description: 'Database ID' },
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Status', key: 'status' },
    { header: 'Created At', key: 'created_at' },
  ],
  options: [{ flags: '--type <type>', description: 'Only backups of this type: daily or manual' }],
  apiCall: (client, opts) =>
    client.get(`/databases/${opts['dbId']}/backups`, { type: opts['type'] as string | undefined }),
  paginated: false,
});
