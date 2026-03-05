import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const dockerRegistriesCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new Docker registry credential',
  options: [
    { flags: '--name <name>', description: 'Registry name', required: true },
    { flags: '--username <username>', description: 'Registry username', required: true },
    {
      flags: '--secret <secret>',
      description: 'Registry password or access token',
      required: true,
    },
    {
      flags: '--registry <registry>',
      description: 'Registry provider (dockerHub, gcr, ecr, github, gitlab, digitalOcean, custom)',
    },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
    Registry: item['registry'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      name: opts['name'],
      username: opts['username'],
      secret: opts['secret'],
    };
    if (opts['registry']) body['registry'] = opts['registry'];
    return client.post('/docker-registries', body);
  },
  successMessage: 'Docker registry credential created successfully.',
});
