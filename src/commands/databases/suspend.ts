import { makeActionCommand } from '../../helpers/command-factory.ts';

export const databasesSuspendCommand = makeActionCommand({
  name: 'suspend',
  description: 'Suspend a database',
  apiCall: (client, id) => client.post(`/databases/${id}/suspend`),
  successMessage: 'Database suspended.',
  spinnerText: 'Suspending database...',
});
