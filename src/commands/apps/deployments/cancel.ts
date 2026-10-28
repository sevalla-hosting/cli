import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { dryRunOption, jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { validateId } from '../../../helpers/validate.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const deploymentsCancelCommand = new Command('cancel')
  .description('Cancel a running deployment')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<deployment-id>', 'Deployment ID')
  .addOption(jsonOption())
  .addOption(dryRunOption())
  .action(async (deploymentId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(opts['appId'] as string, 'app-id');
      validateId(deploymentId, 'deployment-id');
      const path = `/applications/${opts['appId']}/deployments/${deploymentId}/cancel`;
      if (opts['dryRun']) {
        printJson({ dry_run: true, command: 'cancel', method: 'POST', path });
        return;
      }
      if (!json) startSpinner('Cancelling deployment...');
      await client.post(path);
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
