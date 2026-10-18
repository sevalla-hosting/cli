import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const corsPoliciesUpdateCommand = new Command('update')
  .description('Update a CORS policy')
  .requiredOption('--bucket-id <id>', 'Bucket ID')
  .argument('<policy-id>', 'CORS policy ID')
  .requiredOption('--origins <origins>', 'Comma-separated allowed origins')
  .requiredOption(
    '--methods <methods>',
    'Comma-separated allowed methods (GET, PUT, POST, DELETE, HEAD)',
  )
  .option('--headers <headers>', 'Comma-separated allowed headers')
  .addOption(jsonOption())
  .action(async (policyId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      const body: Record<string, unknown> = {
        origins: (opts['origins'] as string).split(','),
        methods: (opts['methods'] as string).split(','),
      };
      if (opts['headers']) body['headers'] = (opts['headers'] as string).split(',');
      if (!json) startSpinner('Updating...');
      const result = await client.patch(
        `/object-storage/${opts['bucketId']}/cors-policies/${policyId}`,
        body,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess('CORS policy updated.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
