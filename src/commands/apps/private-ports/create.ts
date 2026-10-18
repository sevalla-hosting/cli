import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const privatePortsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a private port',
  idArg: 'app-id',
  options: [
    { flags: '--process-id <id>', description: 'Process ID', required: true },
    { flags: '--port <port>', description: 'Port number', required: true },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/applications/${id}/private-ports`, {
      process_id: opts['processId'],
      port: Number(opts['port']),
    }),
  successMessage: 'Private port created.',
});
