import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentHookEnableCommand = makeActionCommand({
  name: 'enable',
  description: 'Enable deployment hook',
  idArg: 'app-id',
  apiCall: (client, id) => client.post(`/applications/${id}/deployment-hook`),
  successMessage: 'Deployment hook enabled.',
});
