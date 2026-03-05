import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printResource } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const processesGetCommand = new Command('get')
  .description('Get process details')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .addOption(jsonOption())
  .action(async (processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Fetching...');
      const result = await client.get<Record<string, unknown>>(
        `/applications/${opts['appId']}/processes/${processId}`,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource({
          ID: result['id'],
          Name: result['name'],
          Type: result['type'],
          Status: result['status'],
        });
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
