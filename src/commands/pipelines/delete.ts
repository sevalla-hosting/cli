import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const pipelinesDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete a pipeline',
  apiCall: (client, id) => client.delete(`/pipelines/${id}`),
  successMessage: 'Pipeline deleted.',
});
