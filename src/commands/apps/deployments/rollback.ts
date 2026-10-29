import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentsRollbackCommand = makeActionCommand({
  name: 'rollback',
  description:
    'Roll back to the most recent successful deployment of a different commit, reusing its build',
  idArg: 'app-id',
  apiCall: (client, id) => client.post(`/applications/${id}/deployments/rollback`),
  successMessage: 'Rollback initiated.',
  spinnerText: 'Rolling back...',
});
