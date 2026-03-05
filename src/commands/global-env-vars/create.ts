import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const globalEnvVarsCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a global environment variable',
  options: [
    { flags: '--key <key>', description: 'Variable key', required: true },
    { flags: '--value <value>', description: 'Variable value', required: true },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Key: item['key'],
    Value: item['value'],
  }),
  apiCall: (client, opts) =>
    client.post('/applications/global-env-vars', {
      key: opts['key'],
      value: opts['value'],
    }),
  successMessage: 'Global environment variable created.',
});
