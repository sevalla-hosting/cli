import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const staticSitesCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new static site',
  options: [
    { flags: '--name <name>', description: 'Static site name', required: true },
    { flags: '--repository <repo>', description: 'Git repository URL', required: true },
    { flags: '--branch <branch>', description: 'Git branch', required: true },
    { flags: '--project <id>', description: 'Project ID' },
    { flags: '--source <source>', description: 'Source type (privateGit, publicGit)' },
    { flags: '--git-type <type>', description: 'Git provider (github, bitbucket, gitlab)' },
    { flags: '--build-command <command>', description: 'Build command' },
    { flags: '--publish-directory <dir>', description: 'Publish directory' },
    { flags: '--node-version <version>', description: 'Node.js version' },
    { flags: '--allow-deploy-paths <paths>', description: 'Glob patterns for paths that trigger deploy (comma-separated)' },
    { flags: '--ignore-deploy-paths <paths>', description: 'Glob patterns for paths to exclude from deploy triggers (comma-separated)' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
      repo_url: opts['repository'],
      default_branch: opts['branch'],
    };
    if (opts['project']) body['project_id'] = opts['project'];
    if (opts['source']) body['source'] = opts['source'];
    if (opts['gitType']) body['git_type'] = opts['gitType'];
    if (opts['buildCommand']) body['build_command'] = opts['buildCommand'];
    if (opts['publishDirectory']) body['published_directory'] = opts['publishDirectory'];
    if (opts['nodeVersion']) body['node_version'] = opts['nodeVersion'];
    if (opts['allowDeployPaths']) body['allow_deploy_paths'] = (opts['allowDeployPaths'] as string).split(',').map((s: string) => s.trim());
    if (opts['ignoreDeployPaths']) body['ignore_deploy_paths'] = (opts['ignoreDeployPaths'] as string).split(',').map((s: string) => s.trim());
    return client.post('/static-sites', body);
  },
  successMessage: 'Static site created successfully.',
});
