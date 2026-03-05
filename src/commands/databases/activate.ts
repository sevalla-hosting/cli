import { makeActionCommand } from '../../helpers/command-factory.ts';

export const databasesActivateCommand = makeActionCommand({
  name: 'activate',
  description: 'Activate a database',
  apiCall: (client, id) => client.post(`/databases/${id}/activate`),
  successMessage: 'Database activated.',
  spinnerText: 'Activating database...',
});
