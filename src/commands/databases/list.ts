import { makeListCommand } from '../../helpers/command-factory.ts';
import type { QueryParams } from '../../client/types.ts';

export const databasesListCommand = makeListCommand({
  name: 'list',
  description: 'List all databases',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'display_name' },
    { header: 'Type', key: 'type' },
    { header: 'Status', key: 'status' },
  ],
  options: [
    { flags: '--search <text>', description: 'Only databases whose name contains this text' },
    { flags: '--status <status>', description: 'Only databases with this status, e.g. ready' },
    {
      flags: '--type <type>',
      description: 'Only databases of this type: postgresql, mariadb, mysql, redis or valkey',
    },
    { flags: '--project <id>', description: 'Only databases in this project' },
  ],
  apiCall: (client, opts) =>
    client.get('/databases', {
      search: opts['search'],
      status: opts['status'],
      type: opts['type'],
      project_id: opts['project'],
    } as QueryParams),
});
