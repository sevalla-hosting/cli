import { Command } from 'commander';
import { createClient } from '../../../../client/api-client.ts';
import { handleError } from '../../../../errors/handler.ts';
import { jsonOption, resolveJsonMode, confirmOption } from '../../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../../output/spinner.ts';

export const stageAppsRemoveCommand = new Command('remove')
  .description('Remove an application from a pipeline stage')
  .argument('<pipeline-id>', 'Pipeline ID')
  .argument('<stage-id>', 'Stage ID')
  .argument('<app-id>', 'Application ID')
  .addOption(jsonOption())
  .addOption(confirmOption())
  .action(
    async (pipelineId: string, stageId: string, appId: string, opts: Record<string, unknown>) => {
      const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
      const json = resolveJsonMode(opts);
      if (!opts['confirm']) {
        console.error('Use --confirm to confirm removal.');
        process.exit(1);
      }
      try {
        if (!json) startSpinner('Removing application...');
        await client.delete(`/pipelines/${pipelineId}/stages/${stageId}/apps/${appId}`);
        stopSpinner();
        if (json) {
          printJson({ deleted: true, pipelineId, stageId, appId });
        } else {
          printSuccess('Application removed from stage.');
        }
      } catch (error) {
        stopSpinner();
        handleError(error, json);
      }
    },
  );
