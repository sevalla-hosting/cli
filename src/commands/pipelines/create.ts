import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const pipelinesCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new pipeline',
  options: [
    { flags: '--name <name>', description: 'Pipeline name', required: true },
    { flags: '--type <type>', description: 'Pipeline type (trunk, branch)', required: true },
    { flags: '--project <id>', description: 'Project ID' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
      type: opts['type'],
    };
    if (opts['project']) body['project_id'] = opts['project'];
    return client.post('/pipelines', body);
  },
  successMessage: 'Pipeline created successfully.',
});
