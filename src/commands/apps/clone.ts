import { makeActionCommand } from '../../helpers/command-factory.ts';

export const appsCloneCommand = makeActionCommand({
  name: 'clone',
  description: 'Clone an application',
  options: [
    {
      flags: '--display-name <name>',
      description: 'Display name for the cloned application',
      required: true,
    },
    { flags: '--cluster <id>', description: 'Cluster ID for the cloned application' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = { display_name: opts['displayName'] };
    if (opts['cluster']) body['cluster_id'] = opts['cluster'];
    return client.post(`/applications/${id}/clone`, body);
  },
  successMessage: 'Application cloned.',
  spinnerText: 'Cloning application...',
});
