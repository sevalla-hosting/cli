import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const backupsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a database backup',
  idArg: 'db-id',
  options: [{ flags: '--name <name>', description: 'Backup name', required: true }],
  apiCall: (client, id, opts) =>
    client.post(`/databases/${id}/backups`, { display_name: opts['name'] }),
  successMessage: 'Database backup created.',
  spinnerText: 'Creating backup...',
});
