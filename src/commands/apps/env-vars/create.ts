import { makeActionCommand } from '../../../helpers/command-factory.ts';
import { omitValue } from '../../../helpers/secrets.ts';

export const envVarsCreateCommand = makeActionCommand<Record<string, unknown>>({
  name: 'create',
  description: 'Create an environment variable',
  idArg: 'app-id',
  options: [
    { flags: '--key <key>', description: 'Variable key', required: true },
    { flags: '--value <value>', description: 'Variable value', required: true },
  ],
  apiCall: (client, id, opts) =>
    client
      .post<Record<string, unknown>>(`/applications/${id}/env-vars`, {
        key: opts['key'],
        value: opts['value'],
      })
      .then(omitValue),
  successMessage: 'Environment variable created.',
});
