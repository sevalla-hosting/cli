import { Command } from 'commander';
import { createClient } from '../../client/api-client.ts';
import { handleError } from '../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../helpers/flags.ts';
import { printJson, printResource } from '../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../output/spinner.ts';

export const apiKeysValidateCommand = new Command('validate')
  .description('Validate the current API key')
  .addOption(jsonOption())
  .action(async (opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Validating...');
      const result = await client.get<Record<string, unknown>>('/api-keys/validate');
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource(result);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
