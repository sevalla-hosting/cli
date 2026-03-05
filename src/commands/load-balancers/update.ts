import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const loadBalancersUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a load balancer',
  options: [
    { flags: '--display-name <name>', description: 'Display name' },
    { flags: '--type <type>', description: 'Load balancer type (DEFAULT, GEO)' },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['displayName']) body['display_name'] = opts['displayName'];
    if (opts['type']) body['type'] = opts['type'];
    return client.patch(`/load-balancers/${id}`, body);
  },
});
