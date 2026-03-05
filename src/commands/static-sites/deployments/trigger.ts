import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentsTriggerCommand = makeActionCommand({
  name: 'trigger',
  description: 'Trigger a new deployment',
  idArg: 'site-id',
  options: [
    { flags: '--branch <branch>', description: 'Branch to deploy' },
    { flags: '--tag <tag>', description: 'Tag to deploy' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['branch']) body['branch'] = opts['branch'];
    if (opts['tag']) body['tag'] = opts['tag'];
    return client.post(`/static-sites/${id}/deployments`, body);
  },
  successMessage: 'Deployment triggered.',
  spinnerText: 'Triggering deployment...',
});
