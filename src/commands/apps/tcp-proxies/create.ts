import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const tcpProxiesCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a TCP proxy',
  idArg: 'app-id',
  options: [{ flags: '--port <port>', description: 'Port number', required: true }],
  apiCall: (client, id, opts) =>
    client.post(`/applications/${id}/tcp-proxies`, { port: Number(opts['port']) }),
  successMessage: 'TCP proxy created.',
});
