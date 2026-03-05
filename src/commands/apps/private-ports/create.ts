import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const privatePortsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a private port',
  idArg: 'app-id',
  options: [
    { flags: '--port <port>', description: 'Port number', required: true },
    { flags: '--protocol <protocol>', description: 'Protocol (TCP/UDP)' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = { port: Number(opts['port']) };
    if (opts['protocol']) body['protocol'] = opts['protocol'];
    return client.post(`/applications/${id}/private-ports`, body);
  },
  successMessage: 'Private port created.',
});
