import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const destinationsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a load balancer destination',
  idArg: 'lb-id',
  options: [
    { flags: '--application-id <id>', description: 'Application ID' },
    { flags: '--port <port>', description: 'Port number' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['applicationId']) body['application_id'] = opts['applicationId'];
    if (opts['port']) body['port'] = Number(opts['port']);
    return client.post(`/load-balancers/${id}/destinations`, body);
  },
  successMessage: 'Destination created.',
});
