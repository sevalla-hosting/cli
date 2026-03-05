import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const processesUpdateCommand = new Command('update')
  .description('Update a process')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .option('--name <name>', 'Process name')
  .option('--command <command>', 'Start command')
  .option('--resource-type <type>', 'Resource type')
  .option('--instances <count>', 'Instance count')
  .addOption(jsonOption())
  .action(async (processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      const body: Record<string, unknown> = {};
      if (opts['name']) body['name'] = opts['name'];
      if (opts['command']) body['command'] = opts['command'];
      if (opts['resourceType']) body['resource_type'] = opts['resourceType'];
      if (opts['instances']) body['instances'] = Number(opts['instances']);
      if (!json) startSpinner('Updating...');
      const result = await client.patch(
        `/applications/${opts['appId']}/processes/${processId}`,
        body,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess('Process updated.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
