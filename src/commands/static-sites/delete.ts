import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const staticSitesDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a static site',
  apiCall: (client, id) => client.delete(`/static-sites/${id}`),
  successMessage: 'Static site deleted.',
});
