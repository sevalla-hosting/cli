import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printResource } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const deploymentsGetCommand = new Command('get')
  .description('Get deployment details')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<deployment-id>', 'Deployment ID')
  .addOption(jsonOption())
  .action(async (deploymentId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Fetching...');
      const result = await client.get<Record<string, unknown>>(
        `/applications/${opts['appId']}/deployments/${deploymentId}`,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource({
          ID: result['id'],
          Status: result['status'],
          'Created At': result['created_at'],
        });
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
