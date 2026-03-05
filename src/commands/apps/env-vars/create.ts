import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const envVarsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create an environment variable',
  idArg: 'app-id',
  options: [
    { flags: '--key <key>', description: 'Variable key', required: true },
    { flags: '--value <value>', description: 'Variable value', required: true },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/applications/${id}/env-vars`, {
      key: opts['key'],
      value: opts['value'],
    }),
  successMessage: 'Environment variable created.',
});
