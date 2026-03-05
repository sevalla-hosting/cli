import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const envVarsUpdateCommand = new Command('update')
  .description('Update an environment variable')
  .requiredOption('--site-id <id>', 'Static site ID')
  .argument('<env-var-id>', 'Environment variable ID')
  .option('--key <key>', 'Variable key')
  .option('--value <value>', 'Variable value')
  .addOption(jsonOption())
  .action(async (envVarId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      const body: Record<string, unknown> = {};
      if (opts['key']) body['key'] = opts['key'];
      if (opts['value']) body['value'] = opts['value'];
      if (!json) startSpinner('Updating...');
      const result = await client.put(`/static-sites/${opts['siteId']}/env-vars/${envVarId}`, body);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess('Environment variable updated.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
