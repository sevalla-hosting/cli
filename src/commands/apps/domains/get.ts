import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printResource } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const domainsGetCommand = new Command('get')
  .description('Get domain details')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<domain-id>', 'Domain ID')
  .addOption(jsonOption())
  .action(async (domainId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Fetching...');
      const result = await client.get<Record<string, unknown>>(
        `/applications/${opts['appId']}/domains/${domainId}`,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource({
          ID: result['id'],
          Name: result['name'],
          Status: result['status'],
          Primary: result['is_primary'],
        });
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
