import { makeListCommand } from '../../../helpers/command-factory.ts';

export const backupTargetsListCommand = makeListCommand({
  name: 'list',
  description: 'List the buckets a database uploads dump backups to',
  parentIdFlag: { name: 'db-id', description: 'Database ID' },
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Bucket', key: 'bucket_name' },
    { header: 'Schedule', key: 'schedule' },
    { header: 'Enabled', key: 'is_enabled' },
    { header: 'Retention (days)', key: 'retention_days' },
  ],
  apiCall: (client, opts) => client.get(`/databases/${opts['dbId']}/backup-targets`),
  paginated: false,
});
