import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';

export const backupsRestoreCommand = makeSubResourceActionCommand({
  name: 'restore',
  description: 'Restore a database backup',
  parentIdName: 'db-id',
  childIdName: 'backup-id',
  apiCall: (client, parentId, childId) =>
    client.post(`/databases/${parentId}/backups/${childId}/restore`),
  successMessage: 'Database backup restored.',
  spinnerText: 'Restoring backup...',
});
