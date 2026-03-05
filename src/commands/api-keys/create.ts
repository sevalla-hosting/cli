import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const apiKeysCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new API key',
  options: [
    { flags: '--name <name>', description: 'API key name', required: true },
    {
      flags: '--capabilities <permissions>',
      description: 'Comma-separated permissions (e.g. APP:READ,DATABASE:CREATE)',
    },
    { flags: '--expires-at <date>', description: 'Expiration date (ISO 8601)' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
    Key: item['key'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      name: opts['name'],
    };
    if (opts['capabilities']) {
      const perms = (opts['capabilities'] as string).split(',').map((p) => p.trim());
      body['capabilities'] = perms.map((permission) => ({ permission }));
    }
    if (opts['expiresAt']) body['expired_at'] = opts['expiresAt'];
    return client.post('/api-keys', body);
  },
  successMessage: 'API key created successfully.',
});
