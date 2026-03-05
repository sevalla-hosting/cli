import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const previewEnableCommand = makeActionCommand({
  name: 'enable',
  description: 'Enable pipeline preview',
  idArg: 'pipeline-id',
  apiCall: (client, id) => client.post(`/pipelines/${id}/preview/enable`),
  successMessage: 'Pipeline preview enabled.',
});
