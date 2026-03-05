import { makeCreateCommand } from '../../helpers/command-factory.ts';

export const loadBalancersCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a new load balancer',
  options: [
    { flags: '--name <name>', description: 'Load balancer name', required: true },
    { flags: '--project <id>', description: 'Project ID' },
    { flags: '--type <type>', description: 'Load balancer type (DEFAULT, GEO)' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
    };
    if (opts['project']) body['project_id'] = opts['project'];
    if (opts['type']) body['type'] = opts['type'];
    return client.post('/load-balancers', body);
  },
  successMessage: 'Load balancer created successfully.',
});
