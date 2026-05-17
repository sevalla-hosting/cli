import { Command } from 'commander';
import { createClient } from '../../../../client/api-client.ts';
import { handleError } from '../../../../errors/handler.ts';
import { printJson, printTable } from '../../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../../output/spinner.ts';
import { jsonOption, resolveJsonMode } from '../../../../helpers/flags.ts';
import { validateId } from '../../../../helpers/validate.ts';
import { Option } from 'commander';
import type { QueryParams } from '../../../../client/types.ts';

interface ExitCodePoint {
  time: string;
  value: string;
  description: string | null;
}

export const exitCodesCommand = new Command('exit-codes')
  .description('Get process exit codes within a time range')
  .argument('<app-id>', 'app-id ID')
  .argument('<process-id>', 'process-id ID')
  .addOption(jsonOption())
  .addOption(new Option('--from <date>', 'Start date (ISO 8601, default: 24h ago)'))
  .addOption(new Option('--to <date>', 'End date (ISO 8601, default: now)'))
  .action(async (appId: string, processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(appId, 'app-id');
      validateId(processId, 'process-id');

      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const query: QueryParams = {
        from: (opts['from'] as string | undefined) ?? dayAgo.toISOString(),
        to: (opts['to'] as string | undefined) ?? now.toISOString(),
      };

      if (!json) startSpinner('Fetching exit codes...');
      const result = await client.get<ExitCodePoint[]>(
        `/applications/${appId}/processes/${processId}/metrics/exit-codes`,
        query,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printTable(result, [
          { header: 'Time', key: 'time' },
          { header: 'Exit code', key: 'value' },
          { header: 'Description', key: 'description' },
        ]);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
