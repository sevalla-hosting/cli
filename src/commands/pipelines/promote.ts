import { makeActionCommand } from '../../helpers/command-factory.ts';

export const pipelinesPromoteCommand = makeActionCommand({
  name: 'promote',
  description: 'Promote a pipeline',
  options: [
    {
      flags: '--source-app-id <id>',
      description: 'Application ID to promote from',
      required: true,
    },
    {
      flags: '--target-app-ids <ids>',
      description: 'Comma-separated application IDs to promote to',
      required: true,
    },
  ],
  apiCall: (client, id, opts) =>
    client.post(`/pipelines/${id}/promote`, {
      source_app_id: opts['sourceAppId'],
      target_app_ids: (opts['targetAppIds'] as string).split(','),
    }),
  successMessage: 'Pipeline promoted.',
  spinnerText: 'Promoting pipeline...',
});
