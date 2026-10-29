import { makeListCommand } from '../../helpers/command-factory.ts';
import type { QueryParams } from '../../client/types.ts';

export const appsListCommand = makeListCommand({
  name: 'list',
  description: 'List all applications',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Status', key: 'status' },
  ],
  options: [
    { flags: '--search <text>', description: 'Only applications whose name contains this text' },
    {
      flags: '--status <status>',
      description: 'Only applications with this status, e.g. deploymentSuccess or deploymentFailed',
    },
    {
      flags: '--source <source>',
      description: 'Only applications with this source: privateGit, publicGit, dockerImage or app',
    },
    { flags: '--project <id>', description: 'Only applications in this project' },
  ],
  apiCall: (client, opts) =>
    client.get('/applications', {
      search: opts['search'],
      status: opts['status'],
      source: opts['source'],
      project_id: opts['project'],
    } as QueryParams),
});
