import { makeSubResourceActionCommand } from '../../../helpers/command-factory.ts';
import { backupTargetBody, backupTargetOptions } from './options.ts';

export const backupTargetsUpdateCommand = makeSubResourceActionCommand({
  name: 'update',
  description: 'Update a backup target; only the fields given change',
  parentIdName: 'db-id',
  childIdName: 'target-id',
  options: [{ flags: '--name <name>', description: 'Backup target name' }, ...backupTargetOptions],
  apiCall: (client, parentId, childId, opts) =>
    client.put(`/databases/${parentId}/backup-targets/${childId}`, backupTargetBody(opts)),
  successMessage: 'Backup target updated.',
  spinnerText: 'Updating backup target...',
});
