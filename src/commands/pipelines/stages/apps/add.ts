import { Command } from 'commander';
import { createClient } from '../../../../client/api-client.ts';
import { handleError } from '../../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../../output/spinner.ts';

export const stageAppsAddCommand = new Command('add')
  .description('Add an application to a pipeline stage')
  .argument('<pipeline-id>', 'Pipeline ID')
  .argument('<stage-id>', 'Stage ID')
  .argument('<app-id>', 'Application ID')
  .addOption(jsonOption())
  .action(
    async (pipelineId: string, stageId: string, appId: string, opts: Record<string, unknown>) => {
      const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
      const json = resolveJsonMode(opts);
      try {
        if (!json) startSpinner('Adding application...');
        const result = await client.post(`/pipelines/${pipelineId}/stages/${stageId}/apps`, {
          app_id: appId,
        });
        stopSpinner();
        if (json) {
          printJson(result ?? { success: true });
        } else {
          printSuccess('Application added to stage.');
        }
      } catch (error) {
        stopSpinner();
        handleError(error, json);
      }
    },
  );
