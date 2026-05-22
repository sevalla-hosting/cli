import { makeActionCommand } from '../../helpers/command-factory.ts';

export const databasesRestartCommand = makeActionCommand({
  name: 'restart',
  description: 'Restart a database',
  apiCall: (client, id) => client.post(`/databases/${id}/restart`),
  successMessage: 'Database restart initiated. Status will transition to updating, then back to ready when complete.',
  spinnerText: 'Initiating database restart...',
});
