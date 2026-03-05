import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const backupsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a database backup',
  idArg: 'db-id',
  apiCall: (client, id) => client.post(`/databases/${id}/backups`),
  successMessage: 'Database backup created.',
  spinnerText: 'Creating backup...',
});
