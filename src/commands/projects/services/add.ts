import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const servicesAddCommand = makeActionCommand({
  name: 'add',
  description: 'Add a service to a project',
  idArg: 'project-id',
  options: [
    { flags: '--service-id <id>', description: 'Service ID' },
    {
      flags: '--service-type <type>',
      description: 'Service type (e.g. app, database, static-site)',
    },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/projects/${id}/services`, {
      service_id: opts['serviceId'],
      service_type: opts['serviceType'] ?? 'app',
    }),
  successMessage: 'Service added to project.',
});
