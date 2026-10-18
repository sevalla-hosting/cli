import { makeActionCommand } from '../../../helpers/command-factory.ts';
import { previewBody, previewOptions } from './update.ts';

export const previewEnableCommand = makeActionCommand({
  name: 'enable',
  description: 'Enable pipeline preview',
  idArg: 'pipeline-id',
  options: previewOptions,
  apiCall: (client, id, opts) => client.post(`/pipelines/${id}/preview/enable`, previewBody(opts)),
  successMessage: 'Pipeline preview enabled.',
});
