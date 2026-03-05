import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const deploymentsCancelCommand = new Command('cancel')
  .description('Cancel a running deployment')
  .requiredOption('--site-id <id>', 'Static site ID')
  .argument('<deployment-id>', 'Deployment ID')
  .addOption(jsonOption())
  .action(async (deploymentId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Cancelling deployment...');
      await client.post(`/static-sites/${opts['siteId']}/deployments/${deploymentId}/cancel`);
      stopSpinner();
      if (json) {
        printJson({ success: true });
      } else {
        printSuccess('Deployment cancelled.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
