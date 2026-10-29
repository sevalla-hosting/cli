import { makeListCommand } from '../../helpers/command-factory.ts';
import type { QueryParams } from '../../client/types.ts';

export const pipelinesListCommand = makeListCommand({
  name: 'list',
  description: 'List all pipelines',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Status', key: 'status' },
  ],
  options: [
    { flags: '--search <text>', description: 'Only pipelines whose name contains this text' },
    { flags: '--type <type>', description: 'Only pipelines of this type: trunk or branch' },
    { flags: '--project <id>', description: 'Only pipelines in this project' },
  ],
  apiCall: (client, opts) =>
    client.get('/pipelines', {
      search: opts['search'],
      type: opts['type'],
      project_id: opts['project'],
    } as QueryParams),
});
