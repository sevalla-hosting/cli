import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const previewDisableCommand = makeActionCommand({
  name: 'disable',
  description: 'Disable pipeline preview',
  idArg: 'pipeline-id',
  apiCall: (client, id) => client.post(`/pipelines/${id}/preview/disable`),
  successMessage: 'Pipeline preview disabled.',
});
