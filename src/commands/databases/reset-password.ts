import { makeActionCommand } from '../../helpers/command-factory.ts';

export const databasesResetPasswordCommand = makeActionCommand({
  name: 'reset-password',
  description: 'Reset database password',
  confirm: 'Resetting the password breaks every connection that uses the current one.',
  options: [{ flags: '--new-password <password>', description: 'New password', required: true }],
  apiCall: (client, id, opts) =>
    client.post(`/databases/${id}/reset-password`, { new_password: opts['newPassword'] }),
  successMessage: 'Database password reset.',
  spinnerText: 'Resetting database password...',
});
