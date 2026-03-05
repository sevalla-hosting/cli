import { makeActionCommand } from '../../helpers/command-factory.ts';

export const databasesResetPasswordCommand = makeActionCommand({
  name: 'reset-password',
  description: 'Reset database password',
  apiCall: (client, id) => client.post(`/databases/${id}/reset-password`),
  successMessage: 'Database password reset.',
  spinnerText: 'Resetting database password...',
});
