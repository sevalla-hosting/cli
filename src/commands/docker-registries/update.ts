import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const dockerRegistriesUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a Docker registry credential',
  options: [
    { flags: '--name <name>', description: 'Registry name' },
    {
      flags: '--registry <registry>',
      description: 'Registry provider (dockerHub, gcr, ecr, github, gitlab, digitalOcean, custom)',
    },
    { flags: '--username <username>', description: 'Registry username' },
    { flags: '--secret <secret>', description: 'Registry password or access token' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
    Registry: item['registry'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['name']) body['name'] = opts['name'];
    if (opts['registry']) body['registry'] = opts['registry'];
    if (opts['username']) body['username'] = opts['username'];
    if (opts['secret']) body['secret'] = opts['secret'];
    return client.patch(`/docker-registries/${id}`, body);
  },
});
