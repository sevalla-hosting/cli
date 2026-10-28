import { makeCreateCommand } from '../../helpers/command-factory.ts';
import { omitValue } from '../../helpers/secrets.ts';

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
  }),
  apiCall: (client, opts) =>
    client
      .post<Record<string, unknown>>('/applications/global-env-vars', {
        key: opts['key'],
        value: opts['value'],
      })
      .then(omitValue),
  successMessage: 'Global environment variable created.',
});
