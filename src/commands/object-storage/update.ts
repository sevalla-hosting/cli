import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const objectStorageUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update an object storage bucket',
  options: [{ flags: '--display-name <name>', description: 'Display name' }],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'] ?? item['name'],
    Status: item['status'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['displayName']) body['display_name'] = opts['displayName'];
    return client.patch(`/object-storage/${id}`, body);
  },
});
