import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { dryRunOption, jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { validateId } from '../../../helpers/validate.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const processesUpdateCommand = new Command('update')
  .description('Update a process')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .option('--name <name>', 'Process name')
  .option('--command <command>', 'Start command')
  .option('--resource-type <id>', 'Process resource type ID')
  .option('--instances <count>', 'Instance count')
  .option('--schedule <cron>', 'Cron expression (cron processes)')
  .option(
    '--job-start-policy <policy>',
    'When a job runs: beforeDeployment, afterSuccessDeployment or afterFailedDeployment',
  )
  .option(
    '--concurrency-policy <policy>',
    'Cron only: Forbid skips a run while the previous one is active, Replace stops it and starts the new one',
  )
  .option(
    '--max-run-time <seconds>',
    'Stop a cron run or job that runs longer than this (0: no limit)',
  )
  .addOption(jsonOption())
  .addOption(dryRunOption())
  .action(async (processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(opts['appId'] as string, 'app-id');
      validateId(processId, 'process-id');
      const body: Record<string, unknown> = {};
      if (opts['name']) body['display_name'] = opts['name'];
      if (opts['command']) body['entrypoint'] = opts['command'];
      if (opts['resourceType']) body['resource_type_id'] = opts['resourceType'];
      if (opts['instances'])
        body['scaling_strategy'] = {
          type: 'manual',
          config: { instanceCount: Number(opts['instances']) },
        };
      if (opts['schedule']) body['schedule'] = opts['schedule'];
      if (opts['jobStartPolicy']) body['job_start_policy'] = opts['jobStartPolicy'];
      if (opts['concurrencyPolicy']) body['concurrency_policy'] = opts['concurrencyPolicy'];
      if (opts['maxRunTime'] !== undefined)
        body['active_deadline_seconds'] = Number(opts['maxRunTime']);
      const path = `/applications/${opts['appId']}/processes/${processId}`;
      if (opts['dryRun']) {
        printJson({ dry_run: true, command: 'update', method: 'PATCH', path, body });
        return;
      }
      if (!json) startSpinner('Updating...');
      const result = await client.patch(path, body);
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
