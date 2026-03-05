import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const processesTriggerCommand = new Command('trigger')
  .description('Trigger a cron job process')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .addOption(jsonOption())
  .action(async (processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Triggering cron job...');
      await client.post(`/applications/${opts['appId']}/processes/${processId}/trigger`);
      stopSpinner();
      if (json) {
        printJson({ success: true });
      } else {
        printSuccess('Cron job triggered.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
