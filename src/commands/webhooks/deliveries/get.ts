import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printResource } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const deliveriesGetCommand = new Command('get')
  .description('Get webhook delivery details')
  .requiredOption('--webhook-id <id>', 'Webhook ID')
  .argument('<delivery-id>', 'Delivery ID')
  .addOption(jsonOption())
  .action(async (deliveryId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Fetching...');
      const result = await client.get<Record<string, unknown>>(
        `/webhooks/${opts['webhookId']}/deliveries/${deliveryId}`,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource({
          ID: result['id'],
          Event: result['event'],
          Status: result['status'],
          'Created At': result['created_at'],
        });
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
