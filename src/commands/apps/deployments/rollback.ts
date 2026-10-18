import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentsRollbackCommand = makeActionCommand({
  name: 'rollback',
  description: 'Rollback to the most recent successful deployment',
  idArg: 'app-id',
  apiCall: (client, id) => client.post(`/applications/${id}/deployments/rollback`),
  successMessage: 'Rollback initiated.',
  spinnerText: 'Rolling back...',
});
