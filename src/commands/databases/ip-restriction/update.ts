import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const ipRestrictionUpdateCommand = new Command('update')
  .description('Update IP restriction rules')
  .argument('<db-id>', 'Database ID')
  .option('--allow <ips>', 'Comma-separated allowed IPs')
  .option('--deny <ips>', 'Comma-separated denied IPs')
  .option('--enabled <bool>', 'Enable or disable')
  .addOption(jsonOption())
  .action(async (dbId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      const body: Record<string, unknown> = {};
      if (opts['allow']) body['allow'] = (opts['allow'] as string).split(',');
      if (opts['deny']) body['deny'] = (opts['deny'] as string).split(',');
      if (opts['enabled'] !== undefined) body['enabled'] = opts['enabled'] === 'true';
      if (!json) startSpinner('Updating...');
      const result = await client.put(`/databases/${dbId}/ip-restriction`, body);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess('IP restriction updated.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
