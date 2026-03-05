import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const projectsDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a project',
  apiCall: (client, id) => client.delete(`/projects/${id}`),
  successMessage: 'Project deleted.',
});
