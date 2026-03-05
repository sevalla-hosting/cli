import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const projectsUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a project',
  options: [{ flags: '--name <name>', description: 'Project name' }],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['name']) body['display_name'] = opts['name'];
    return client.patch(`/projects/${id}`, body);
  },
});
