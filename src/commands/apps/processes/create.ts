import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const processesCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a new process',
  idArg: 'app-id',
  options: [
    { flags: '--name <name>', description: 'Process name', required: true },
    { flags: '--type <type>', description: 'Process type', required: true },
    { flags: '--command <command>', description: 'Start command' },
    { flags: '--resource-type <type>', description: 'Resource type' },
    { flags: '--instances <count>', description: 'Instance count' },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {
      name: opts['name'],
      type: opts['type'],
    };
    if (opts['command']) body['command'] = opts['command'];
    if (opts['resourceType']) body['resource_type'] = opts['resourceType'];
    if (opts['instances']) body['instances'] = Number(opts['instances']);
    return client.post(`/applications/${id}/processes`, body);
  },
  successMessage: 'Process created.',
  spinnerText: 'Creating process...',
});
