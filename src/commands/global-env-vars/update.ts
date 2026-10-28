import { makeUpdateCommand } from '../../helpers/command-factory.ts';
import { omitValue } from '../../helpers/secrets.ts';

export const globalEnvVarsUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a global environment variable',
  options: [
    { flags: '--key <key>', description: 'Variable key' },
    { flags: '--value <value>', description: 'Variable value' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Key: item['key'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['key']) body['key'] = opts['key'];
    if (opts['value']) body['value'] = opts['value'];
    return client
      .put<Record<string, unknown>>(`/applications/global-env-vars/${id}`, body)
      .then(omitValue);
  },
});
