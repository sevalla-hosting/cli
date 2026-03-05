import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const corsPoliciesCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a CORS policy',
  idArg: 'bucket-id',
  options: [
    { flags: '--origins <origins>', description: 'Allowed origins' },
    { flags: '--methods <methods>', description: 'Allowed methods' },
    { flags: '--headers <headers>', description: 'Allowed headers' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['origins']) body['origins'] = (opts['origins'] as string).split(',');
    if (opts['methods']) body['methods'] = (opts['methods'] as string).split(',');
    if (opts['headers']) body['headers'] = (opts['headers'] as string).split(',');
    return client.post(`/object-storage/${id}/cors-policies`, body);
  },
  successMessage: 'CORS policy created.',
});
