import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { printJson, printResource } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

function formatDisk(disk: unknown): string {
  if (!disk || typeof disk !== 'object') return 'None';
  const { size_gib, mount_path } = disk as { size_gib?: number; mount_path?: string | null };
  return mount_path ? `${size_gib} GiB at ${mount_path}` : `${size_gib} GiB`;
}

export const processesGetCommand = new Command('get')
  .description('Get process details')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .addOption(jsonOption())
  .action(async (processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Fetching...');
      const result = await client.get<Record<string, unknown>>(
        `/applications/${opts['appId']}/processes/${processId}`,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource({
          ID: result['id'],
          Name: result['display_name'],
          Key: result['key'],
          Type: result['type'],
          Schedule: result['schedule'],
          'Concurrency Policy': result['concurrency_policy'],
          'Max Run Time (s)': result['active_deadline_seconds'],
          Disk: formatDisk(result['disk']),
        });
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
