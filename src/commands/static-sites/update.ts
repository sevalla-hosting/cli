import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const staticSitesUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a static site',
  options: [
    { flags: '--display-name <name>', description: 'Display name' },
    { flags: '--branch <branch>', description: 'Git branch' },
    { flags: '--build-command <command>', description: 'Build command' },
    { flags: '--publish-directory <dir>', description: 'Publish directory' },
    { flags: '--allow-deploy-paths <paths>', description: 'Glob patterns for paths that trigger deploy (comma-separated)' },
    { flags: '--ignore-deploy-paths <paths>', description: 'Glob patterns for paths to exclude from deploy triggers (comma-separated)' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['displayName']) body['display_name'] = opts['displayName'];
    if (opts['branch']) body['default_branch'] = opts['branch'];
    if (opts['buildCommand']) body['build_command'] = opts['buildCommand'];
    if (opts['publishDirectory']) body['published_directory'] = opts['publishDirectory'];
    if (opts['allowDeployPaths']) body['allow_deploy_paths'] = (opts['allowDeployPaths'] as string).split(',').map((s: string) => s.trim());
    if (opts['ignoreDeployPaths']) body['ignore_deploy_paths'] = (opts['ignoreDeployPaths'] as string).split(',').map((s: string) => s.trim());
    return client.patch(`/static-sites/${id}`, body);
  },
});
