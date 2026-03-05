import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentHookRegenerateCommand = makeActionCommand({
  name: 'regenerate',
  description: 'Regenerate deployment hook URL',
  idArg: 'app-id',
  apiCall: (client, id) => client.put(`/applications/${id}/deployment-hook`),
  successMessage: 'Deployment hook regenerated.',
});
