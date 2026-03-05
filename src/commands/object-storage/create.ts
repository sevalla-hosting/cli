import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const objectStorageCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new object storage bucket',
  options: [
    { flags: '--name <name>', description: 'Bucket name', required: true },
    { flags: '--project <id>', description: 'Project ID' },
    { flags: '--location <location>', description: 'Location (apac, eeur, enam, oc, weur, wnam)' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
    };
    if (opts['project']) body['project_id'] = opts['project'];
    if (opts['location']) body['location'] = opts['location'];
    return client.post('/object-storage', body);
  },
  successMessage: 'Object storage bucket created successfully.',
});
