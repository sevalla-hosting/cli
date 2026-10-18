import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const corsPoliciesCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a CORS policy',
  idArg: 'bucket-id',
  options: [
    {
      flags: '--origins <origins>',
      description: 'Comma-separated allowed origins',
      required: true,
    },
    {
      flags: '--methods <methods>',
      description: 'Comma-separated allowed methods (GET, PUT, POST, DELETE, HEAD)',
      required: true,
    },
    { flags: '--headers <headers>', description: 'Comma-separated allowed headers' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {
      origins: (opts['origins'] as string).split(','),
      methods: (opts['methods'] as string).split(','),
    };
    if (opts['headers']) body['headers'] = (opts['headers'] as string).split(',');
    return client.post(`/object-storage/${id}/cors-policies`, body);
  },
  successMessage: 'CORS policy created.',
});
