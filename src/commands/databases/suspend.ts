import { makeActionCommand } from '../../helpers/command-factory.ts';

export const databasesSuspendCommand = makeActionCommand({
  name: 'suspend',
  description: 'Suspend a database',
  confirm: 'Suspending takes the database offline until it is activated again.',
  apiCall: (client, id) => client.post(`/databases/${id}/suspend`),
  successMessage: 'Database suspended.',
  spinnerText: 'Suspending database...',
});
