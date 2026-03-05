import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const apiKeysUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update an API key',
  options: [{ flags: '--name <name>', description: 'API key name' }],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['name']) body['name'] = opts['name'];
    return client.patch(`/api-keys/${id}`, body);
  },
});
