import { makeActionCommand } from '../../helpers/command-factory.ts';

export const pipelinesPromoteCommand = makeActionCommand({
  name: 'promote',
  description: 'Promote a pipeline',
  apiCall: (client, id) => client.post(`/pipelines/${id}/promote`),
  successMessage: 'Pipeline promoted.',
  spinnerText: 'Promoting pipeline...',
});
