import { makeUpdateCommand } from '../../../helpers/command-factory.ts';

// Shared with `preview enable`, which takes the same body
export const previewOptions = [
  { flags: '--repo-url <url>', description: 'Git repository URL' },
  {
    flags: '--auto-create-app <bool>',
    description: 'Create a preview app when a pull request is opened (true/false)',
  },
  { flags: '--delete-stale-apps <bool>', description: 'Delete stale preview apps (true/false)' },
  {
    flags: '--stale-app-days <days>',
    description: 'Days without deployment before an app is stale',
  },
];

export function previewBody(opts: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (opts['repoUrl']) body['repo_url'] = opts['repoUrl'];
  if (opts['autoCreateApp'] !== undefined)
    body['auto_create_app'] = opts['autoCreateApp'] === 'true';
  if (opts['deleteStaleApps'] !== undefined)
    body['delete_stale_apps'] = opts['deleteStaleApps'] === 'true';
  if (opts['staleAppDays'] !== undefined) body['stale_app_days'] = Number(opts['staleAppDays']);
  return body;
}

export const previewUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update pipeline preview settings',
  idArg: 'pipeline-id',
  options: previewOptions,
  apiCall: (client, id, opts) => client.put(`/pipelines/${id}/preview`, previewBody(opts)),
});
