import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const ipRestrictionUpdateCommand = new Command('update')
  .description('Update IP restriction rules')
  .argument('<app-id>', 'Application ID')
  .option('--type <type>', 'Restriction type: allow or deny')
  .option('--ip-list <ips>', 'Comma-separated IP addresses/CIDRs')
  .option('--enabled <bool>', 'Enable or disable')
  .addOption(jsonOption())
  .action(async (appId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      const body: Record<string, unknown> = {};
      if (opts['type']) body['type'] = opts['type'];
      if (opts['ipList']) body['ip_list'] = (opts['ipList'] as string).split(',');
      if (opts['enabled'] !== undefined) body['is_enabled'] = opts['enabled'] === 'true';
      if (!json) startSpinner('Updating...');
      const result = await client.put(`/applications/${appId}/ip-restriction`, body);
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
