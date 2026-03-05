import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentsRollbackCommand = makeActionCommand({
  name: 'rollback',
  description: 'Rollback to a previous deployment',
  idArg: 'app-id',
  options: [
    { flags: '--deployment-id <id>', description: 'Deployment ID to rollback to', required: true },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/applications/${id}/deployments/rollback`, {
      deployment_id: opts['deploymentId'],
    }),
  successMessage: 'Rollback initiated.',
  spinnerText: 'Rolling back...',
});
