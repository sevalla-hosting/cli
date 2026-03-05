import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const databasesCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new database',
  options: [
    { flags: '--name <name>', description: 'Database name', required: true },
    {
      flags: '--type <type>',
      description: 'Database type (postgresql, mariadb, mysql, mongodb, redis, valkey)',
      required: true,
    },
    { flags: '--db-version <version>', description: 'Database version', required: true },
    { flags: '--cluster <id>', description: 'Cluster ID', required: true },
    { flags: '--resource-type <id>', description: 'Resource type ID', required: true },
    { flags: '--db-name <name>', description: 'Database name within the server', required: true },
    { flags: '--db-password <password>', description: 'Database password', required: true },
    { flags: '--project <id>', description: 'Project ID' },
    { flags: '--db-user <user>', description: 'Database username' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Type: item['type'],
    Status: item['status'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
      type: opts['type'],
      version: opts['dbVersion'],
      cluster_id: opts['cluster'],
      resource_type_id: opts['resourceType'],
      db_name: opts['dbName'],
      db_password: opts['dbPassword'],
    };
    if (opts['project']) body['project_id'] = opts['project'];
    if (opts['dbUser']) body['db_user'] = opts['dbUser'];
    return client.post('/databases', body);
  },
  successMessage: 'Database created successfully.',
});
