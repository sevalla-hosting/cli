import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const deploymentsTriggerCommand = makeActionCommand({
  name: 'trigger',
  description: 'Trigger a new deployment',
  idArg: 'app-id',
  options: [
    { flags: '--branch <branch>', description: 'Branch to deploy' },
    {
      flags: '--commit <sha>',
      description: 'Full 40-character SHA of the commit to deploy (default: latest on the branch)',
    },
    { flags: '--skip-build-cache', description: 'Rebuild every layer instead of using the cache' },
    {
      flags: '--restart',
      description: 'Redeploy the last successful build without rebuilding',
    },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['branch']) body['branch'] = opts['branch'];
    if (opts['commit']) body['commit_sha'] = opts['commit'];
    if (opts['skipBuildCache']) body['skip_build_cache'] = true;
    if (opts['restart']) body['is_restart'] = true;
    return client.post(`/applications/${id}/deployments`, body);
  },
  successMessage: 'Deployment triggered.',
  spinnerText: 'Triggering deployment...',
});
