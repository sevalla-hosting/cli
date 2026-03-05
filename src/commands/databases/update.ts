import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const databasesUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a database',
  options: [
    { flags: '--display-name <name>', description: 'Display name' },
    { flags: '--resource-type <id>', description: 'Resource type ID' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Type: item['type'],
    Status: item['status'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['displayName']) body['display_name'] = opts['displayName'];
    if (opts['resourceType']) body['resource_type_id'] = opts['resourceType'];
    return client.patch(`/databases/${id}`, body);
  },
});
