import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const internalConnectionsCreateCommand = makeActionCommand({
  name: 'internal-create',
  description: 'Create an internal database connection',
  idArg: 'db-id',
  options: [
    { flags: '--target-id <id>', description: 'Application or database ID', required: true },
    { flags: '--target-type <type>', description: 'Target type: app or database (default: app)' },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/databases/${id}/internal-connections`, {
      target_id: opts['targetId'],
      target_type: opts['targetType'] ?? 'app',
    }),
  successMessage: 'Internal connection created.',
  spinnerText: 'Creating internal connection...',
});
