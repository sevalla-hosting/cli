import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const dockerRegistriesDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a Docker registry',
  apiCall: (client, id) => client.delete(`/docker-registries/${id}`),
  successMessage: 'Docker registry deleted.',
});
