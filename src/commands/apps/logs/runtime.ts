import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const runtimeLogsCommand = new Command('runtime')
  .description('Get application runtime logs')
  .argument('<app-id>', 'Application ID')
  .addOption(jsonOption())
  .action(async (appId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Fetching logs...');
      const result = await client.get<unknown>(`/applications/${appId}/runtime-logs`);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        if (Array.isArray(result)) {
          for (const line of result) {
            console.log(typeof line === 'string' ? line : JSON.stringify(line));
          }
        } else {
          console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
        }
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
