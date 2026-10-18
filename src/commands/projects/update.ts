import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const projectsUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a project',
  options: [{ flags: '--name <name>', description: 'Project name', required: true }],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
  }),
  apiCall: (client, id, opts) => client.patch(`/projects/${id}`, { display_name: opts['name'] }),
});
