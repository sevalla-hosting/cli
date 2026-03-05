import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const appsCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new application',
  options: [
    { flags: '--name <name>', description: 'Application name', required: true },
    { flags: '--cluster <id>', description: 'Cluster ID', required: true },
    {
      flags: '--source <source>',
      description: 'Source type (privateGit, publicGit, dockerImage)',
      required: true,
    },
    { flags: '--project <id>', description: 'Project ID' },
    { flags: '--git-type <type>', description: 'Git provider (github, bitbucket, gitlab)' },
    { flags: '--repository <repo>', description: 'Git repository URL' },
    { flags: '--branch <branch>', description: 'Git branch' },
    { flags: '--docker-registry <id>', description: 'Docker registry credential ID' },
    { flags: '--docker-image <image>', description: 'Docker image' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
      cluster_id: opts['cluster'],
      source: opts['source'],
    };
    if (opts['project']) body['project_id'] = opts['project'];
    if (opts['gitType']) body['git_type'] = opts['gitType'];
    if (opts['repository']) body['repo_url'] = opts['repository'];
    if (opts['branch']) body['default_branch'] = opts['branch'];
    if (opts['dockerRegistry']) body['docker_registry_credential_id'] = opts['dockerRegistry'];
    if (opts['dockerImage']) body['docker_image'] = opts['dockerImage'];
    return client.post('/applications', body);
  },
  successMessage: 'Application created successfully.',
  apiPath: '/applications',
});
