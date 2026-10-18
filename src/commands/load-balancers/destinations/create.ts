import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const destinationsCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a load balancer destination',
  idArg: 'lb-id',
  options: [
    {
      flags: '--service-type <type>',
      description: 'Service type: APP, STATIC_SITE, OBJECT_STORAGE, EXTERNAL or LOAD_BALANCER',
      required: true,
    },
    { flags: '--service-id <id>', description: 'Service ID (not used for EXTERNAL)' },
    { flags: '--url <url>', description: 'External URL (required for EXTERNAL)' },
    { flags: '--weight <weight>', description: 'Traffic weight for weighted routing' },
    { flags: '--latitude <lat>', description: 'Latitude for GEO routing' },
    { flags: '--longitude <lng>', description: 'Longitude for GEO routing' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = { service_type: opts['serviceType'] };
    if (opts['serviceId']) body['service_id'] = opts['serviceId'];
    if (opts['url']) body['url'] = opts['url'];
    if (opts['weight'] !== undefined) body['weight'] = Number(opts['weight']);
    if (opts['latitude'] !== undefined) body['latitude'] = Number(opts['latitude']);
    if (opts['longitude'] !== undefined) body['longitude'] = Number(opts['longitude']);
    return client.post(`/load-balancers/${id}/destinations`, body);
  },
  successMessage: 'Destination created.',
});
