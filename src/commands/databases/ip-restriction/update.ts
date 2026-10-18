import { Command, Option } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const ipRestrictionUpdateCommand = new Command('update')
  .description('Update IP restriction rules')
  .argument('<db-id>', 'Database ID')
  .requiredOption('--type <type>', 'Restriction type: allow or deny')
  .requiredOption('--ip-list <ips>', 'Comma-separated IP addresses/CIDRs')
  .addOption(
    new Option('--enabled <bool>', 'Enable or disable')
      .choices(['true', 'false'])
      .makeOptionMandatory(),
  )
  .addOption(jsonOption())
  .action(async (dbId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      const body = {
        type: opts['type'],
        ip_list: (opts['ipList'] as string).split(',').filter(Boolean),
        is_enabled: opts['enabled'] === 'true',
      };
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
