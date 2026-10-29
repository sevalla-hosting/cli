import { makeActionCommand } from '../../../helpers/command-factory.ts';
import { backupTargetBody, backupTargetOptions } from './options.ts';

export const backupTargetsCreateCommand = makeActionCommand({
  name: 'create',
  description:
    'Add a bucket that receives dump backups: a Sevalla object storage bucket (--object-storage) or an external S3-compatible one (--bucket, --access-key, --secret-key)',
  idArg: 'db-id',
  options: [
    { flags: '--name <name>', description: 'Backup target name', required: true },
    ...backupTargetOptions,
  ],
  apiCall: (client, id, opts) =>
    client.post(`/databases/${id}/backup-targets`, backupTargetBody(opts)),
  successMessage: 'Backup target created. Scheduled backups start once it is applied.',
  spinnerText: 'Creating backup target...',
});
