import { Command } from 'commander';
import { createClient } from '../../client/api-client.ts';
import { handleError } from '../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../helpers/flags.ts';
import { printJson, printResource } from '../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../output/spinner.ts';

type Capability = { permission: string; resource_id: string | null };

export const apiKeysCurrentCommand = new Command('current')
  .description('Get the API key in use and what it is allowed to do')
  .addOption(jsonOption())
  .action(async (opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Fetching...');
      const result = await client.get<Record<string, unknown>>('/api-keys/me');
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource({
          ID: result['id'],
          Name: result['name'],
          Enabled: result['is_enabled'],
          Source: result['source'],
          Token: result['masked_token'],
          'Expires At': result['expired_at'],
          Capabilities: (result['capabilities'] as Capability[])
            .map((c) => (c.resource_id ? `${c.permission} (${c.resource_id})` : c.permission))
            .join('\n'),
        });
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
