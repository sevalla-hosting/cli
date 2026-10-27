import { Command } from 'commander';
import { createClient } from '../../../../client/api-client.ts';
import { handleError } from '../../../../errors/handler.ts';
import { jsonOption, resolveJsonMode, confirmOption } from '../../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../../output/spinner.ts';

export const processDiskDeleteCommand = new Command('delete')
  .description('Detach the disk from a process and delete its data')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .addOption(jsonOption())
  .addOption(confirmOption())
  .action(async (processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    if (!opts['confirm']) {
      console.error('Use --confirm to confirm deletion.');
      process.exit(1);
    }
    try {
      if (!json) startSpinner('Deleting...');
      await client.delete(`/applications/${opts['appId']}/processes/${processId}/disk`);
      stopSpinner();
      if (json) {
        printJson({ deleted: true });
      } else {
        printSuccess('Process disk detached.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
