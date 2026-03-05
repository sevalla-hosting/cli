import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const projectsCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new project',
  options: [{ flags: '--name <name>', description: 'Project name', required: true }],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
    };
    return client.post('/projects', body);
  },
  successMessage: 'Project created successfully.',
});
