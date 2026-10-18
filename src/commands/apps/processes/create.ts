import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const processesCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a new process',
  idArg: 'app-id',
  options: [
    { flags: '--name <name>', description: 'Process name', required: true },
    {
      flags: '--type <type>',
      description: 'Process type: web, worker, cron or job',
      required: true,
    },
    {
      flags: '--resource-type <id>',
      description: 'Process resource type ID (see `sevalla resources process-types`)',
      required: true,
    },
    { flags: '--command <command>', description: 'Start command' },
    { flags: '--instances <count>', description: 'Instance count (default: 1)' },
    { flags: '--schedule <cron>', description: 'Cron expression (required for cron processes)' },
    {
      flags: '--job-start-policy <policy>',
      description:
        'When a job runs: beforeDeployment, afterSuccessDeployment or afterFailedDeployment (required for job processes)',
    },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {
      display_name: opts['name'],
      type: opts['type'],
      resource_type_id: opts['resourceType'],
      scaling_strategy: {
        type: 'manual',
        config: { instanceCount: Number(opts['instances'] ?? 1) },
      },
    };
    if (opts['command']) body['entrypoint'] = opts['command'];
    if (opts['schedule']) body['schedule'] = opts['schedule'];
    if (opts['jobStartPolicy']) body['job_start_policy'] = opts['jobStartPolicy'];
    return client.post(`/applications/${id}/processes`, body);
  },
  successMessage: 'Process created.',
  spinnerText: 'Creating process...',
});
