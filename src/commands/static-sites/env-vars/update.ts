import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { dryRunOption, jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { maskSecrets, omitValue } from '../../../helpers/secrets.ts';
import { validateId } from '../../../helpers/validate.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const envVarsUpdateCommand = new Command('update')
  .description('Update an environment variable')
  .requiredOption('--site-id <id>', 'Static site ID')
  .argument('<env-var-id>', 'Environment variable ID')
  .option('--key <key>', 'Variable key')
  .option('--value <value>', 'Variable value')
  .addOption(jsonOption())
  .addOption(dryRunOption())
  .action(async (envVarId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(opts['siteId'] as string, 'site-id');
      validateId(envVarId, 'env-var-id');
      const body: Record<string, unknown> = {};
      if (opts['key']) body['key'] = opts['key'];
      if (opts['value']) body['value'] = opts['value'];
      const path = `/static-sites/${opts['siteId']}/env-vars/${envVarId}`;
      if (opts['dryRun']) {
        printJson({
          dry_run: true,
          command: 'update',
          method: 'PUT',
          path,
          body: maskSecrets(body),
        });
        return;
      }
      if (!json) startSpinner('Updating...');
      const result = await client.put<Record<string, unknown>>(path, body);
      stopSpinner();
      if (json) {
        printJson(omitValue(result));
      } else {
        printSuccess('Environment variable updated.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
