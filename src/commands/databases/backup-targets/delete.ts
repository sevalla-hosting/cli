import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const backupTargetsDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Detach a backup target; the dump files already uploaded stay in the bucket',
  parentIdName: 'db-id',
  childIdName: 'target-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/databases/${parentId}/backup-targets/${childId}`),
  successMessage: 'Backup target deleted.',
});
