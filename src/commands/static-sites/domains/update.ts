import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const domainsUpdateCommand = new Command('update')
  .description('Update static site system domain')
  .requiredOption('--site-id <id>', 'Static site ID')
  .argument('<domain-id>', 'Domain ID')
  .addOption(jsonOption())
  .action(async (domainId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Updating...');
      const result = await client.patch(`/static-sites/${opts['siteId']}/domains/${domainId}`);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess('Domain updated.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
