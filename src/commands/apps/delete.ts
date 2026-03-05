import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const appsDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete an application',
  apiCall: (client, id) => client.delete(`/applications/${id}`),
  successMessage: 'Application deleted.',
});
