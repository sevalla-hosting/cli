import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const externalBackupsRestoreCommand = makeSubResourceActionCommand({
  name: 'restore',
  description: 'Restore a dump backup into the database, or into another one with --target-db',
  confirm: "Restoring replaces the destination database's current data with the backup.",
  parentIdName: 'db-id',
  childIdName: 'backup-id',
  options: [
    {
      flags: '--target-db <id>',
      description: 'Database to restore into instead (same type and cluster)',
    },
  ],
  apiCall: (client, parentId, childId, opts) =>
    client.post(`/databases/${parentId}/external-backups/${childId}/restore`, {
      target_database_id: opts['targetDb'],
    }),
  successMessage: 'Restore started. The database status shows its progress.',
  spinnerText: 'Starting restore...',
});
