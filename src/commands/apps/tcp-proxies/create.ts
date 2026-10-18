import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const tcpProxiesCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a TCP proxy',
  idArg: 'app-id',
  options: [
    { flags: '--process-id <id>', description: 'Process ID', required: true },
    { flags: '--port <port>', description: 'Port number', required: true },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/applications/${id}/tcp-proxies`, {
      process_id: opts['processId'],
      port: Number(opts['port']),
    }),
  successMessage: 'TCP proxy created.',
});
