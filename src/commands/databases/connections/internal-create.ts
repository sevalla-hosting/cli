import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const internalConnectionsCreateCommand = makeActionCommand({
  name: 'internal-create',
  description: 'Create an internal database connection',
  idArg: 'db-id',
  options: [{ flags: '--application-id <id>', description: 'Application ID', required: true }],
  apiCall: (client, id, opts) =>
    client.post(`/databases/${id}/internal-connections`, {
      application_id: opts['applicationId'],
    }),
  successMessage: 'Internal connection created.',
  spinnerText: 'Creating internal connection...',
});
