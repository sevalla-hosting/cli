import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const externalBackupsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a dump backup file from its bucket',
  parentIdName: 'db-id',
  childIdName: 'backup-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/databases/${parentId}/external-backups/${childId}`),
  successMessage: 'External backup deleted.',
});
