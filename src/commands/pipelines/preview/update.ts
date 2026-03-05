import { makeUpdateCommand } from '../../../helpers/command-factory.ts';

export const previewUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update pipeline preview settings',
  idArg: 'pipeline-id',
  options: [
    { flags: '--branch <branch>', description: 'Preview branch' },
    { flags: '--auto-deploy', description: 'Enable auto deploy' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['branch']) body['branch'] = opts['branch'];
    if (opts['autoDeploy'] !== undefined) body['auto_deploy'] = opts['autoDeploy'];
    return client.put(`/pipelines/${id}/preview`, body);
  },
});
