import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const appsUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update an application',
  options: [
    { flags: '--display-name <name>', description: 'Display name' },
    { flags: '--branch <branch>', description: 'Git branch' },
    { flags: '--build-type <type>', description: 'Build type' },
    { flags: '--dockerfile-path <path>', description: 'Dockerfile path' },
    { flags: '--docker-image <image>', description: 'Docker image' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiPath: '/applications',
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['displayName']) body['display_name'] = opts['displayName'];
    if (opts['branch']) body['default_branch'] = opts['branch'];
    if (opts['buildType']) body['build_type'] = opts['buildType'];
    if (opts['dockerfilePath']) body['dockerfile_path'] = opts['dockerfilePath'];
    if (opts['dockerImage']) body['docker_image'] = opts['dockerImage'];
    return client.patch(`/applications/${id}`, body);
  },
});
