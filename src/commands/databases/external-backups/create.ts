import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const externalBackupsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Dump the database to a backup target bucket',
  idArg: 'db-id',
  options: [
    { flags: '--name <name>', description: 'Backup name', required: true },
    {
      flags: '--target-id <id>',
      description: 'Backup target to upload to (required when the database has more than one)',
    },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/databases/${id}/external-backups`, {
      display_name: opts['name'],
      target_id: opts['targetId'],
    }),
  successMessage: 'External backup started. It is listed once the upload completes.',
  spinnerText: 'Starting backup...',
});
