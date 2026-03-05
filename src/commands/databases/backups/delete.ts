import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const backupsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a database backup',
  parentIdName: 'db-id',
  childIdName: 'backup-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/databases/${parentId}/backups/${childId}`),
  successMessage: 'Database backup deleted.',
});
