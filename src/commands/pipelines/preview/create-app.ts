import { makeActionCommand } from '../../../helpers/command-factory.ts';

export function previewAppBody(opts: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = { branch: opts['branch'] };
  if (opts['pullRequest'] !== undefined) body['pull_request_number'] = Number(opts['pullRequest']);
  return body;
}

export const previewCreateAppCommand = makeActionCommand<{ id: string; display_name: string }>({
  name: 'create-app',
  description: 'Create a preview app for a branch or pull request from the preview app settings',
  idArg: 'pipeline-id',
  options: [
    { flags: '--branch <branch>', description: 'Git branch to build and deploy', required: true },
    {
      flags: '--pull-request <number>',
      description:
        'Pull request the preview app belongs to; it is deleted when the pull request closes',
    },
  ],
  apiCall: (client, id, opts) => client.post(`/pipelines/${id}/preview/apps`, previewAppBody(opts)),
  successMessage: (app) =>
    `Preview app ${app.display_name} created. Its first deployment has started.`,
  displayFields: (app) => ({ ID: app.id, Name: app.display_name }),
});
