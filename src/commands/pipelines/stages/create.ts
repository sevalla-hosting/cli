import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const stagesCreateCommand = makeActionCommand({
  name: 'create',
  description: 'Create a pipeline stage',
  idArg: 'pipeline-id',
  options: [
    { flags: '--name <name>', description: 'Stage name' },
    {
      flags: '--insert-before <order>',
      description: 'Insert before this order position (default: 0)',
    },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['name']) body['display_name'] = opts['name'];
    if (opts['insertBefore'] !== undefined) body['insert_before'] = Number(opts['insertBefore']);
    else body['insert_before'] = 0;
    return client.post(`/pipelines/${id}/stages`, body);
  },
  successMessage: 'Stage created.',
});
