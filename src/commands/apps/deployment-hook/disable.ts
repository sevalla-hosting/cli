import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentHookDisableCommand = makeActionCommand({
  name: 'disable',
  description: 'Disable deployment hook',
  idArg: 'app-id',
  apiCall: (client, id) => client.delete(`/applications/${id}/deployment-hook`),
  successMessage: 'Deployment hook disabled.',
});
