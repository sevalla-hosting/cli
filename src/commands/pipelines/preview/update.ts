import { makeUpdateCommand } from '../../../helpers/command-factory.ts';
import { SevallaCliError } from '../../../errors/cli-error.ts';

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
  {
    flags: '--preview-app <json>',
    description:
      'Preview app settings as JSON: location, build, processes, disks, TCP proxies and environment variables',
  },
];

function parseBool(value: unknown, flag: string): boolean {
  if (value !== 'true' && value !== 'false') {
    throw new SevallaCliError(`${flag} must be true or false.`);
  }
  return value === 'true';
}

function parseJson(value: unknown, flag: string): unknown {
  try {
    return JSON.parse(String(value));
  } catch {
    throw new SevallaCliError(`${flag} must be valid JSON.`);
  }
}

export function previewBody(opts: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (opts['repoUrl']) body['repo_url'] = opts['repoUrl'];
  if (opts['autoCreateApp'] !== undefined)
    body['auto_create_app'] = parseBool(opts['autoCreateApp'], '--auto-create-app');
  if (opts['deleteStaleApps'] !== undefined)
    body['delete_stale_apps'] = parseBool(opts['deleteStaleApps'], '--delete-stale-apps');
  if (opts['staleAppDays'] !== undefined) body['stale_app_days'] = Number(opts['staleAppDays']);
  if (opts['previewApp'] !== undefined)
    body['preview_app'] = parseJson(opts['previewApp'], '--preview-app');
  return body;
}

export const previewUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update pipeline preview settings',
  idArg: 'pipeline-id',
  options: previewOptions,
  apiCall: (client, id, opts) => client.put(`/pipelines/${id}/preview`, previewBody(opts)),
});
