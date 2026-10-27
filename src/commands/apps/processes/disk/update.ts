import { Command } from 'commander';
import { createClient } from '../../../../client/api-client.ts';
import { handleError } from '../../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../../helpers/flags.ts';
import { printJson, printResource, printSuccess } from '../../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../../output/spinner.ts';

export const processDiskUpdateCommand = new Command('update')
  .description('Attach a disk to a process, or grow or move its disk')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .requiredOption(
    '--resource-type <id>',
    'Disk resource type ID, which sets the size (see `resources disk-types`). A disk can grow but not shrink.',
  )
  .requiredOption('--mount-path <path>', 'Path inside the container where the disk is mounted')
  .addOption(jsonOption())
  .action(async (processId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (!json) startSpinner('Updating...');
      const result = await client.put<Record<string, unknown>>(
        `/applications/${opts['appId']}/processes/${processId}/disk`,
        { resource_type_id: opts['resourceType'], mount_path: opts['mountPath'] },
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess('Process disk updated.');
        printResource({
          'Resource type': result['resource_type_name'],
          'Size (GiB)': result['size_gib'],
          'Mount path': result['mount_path'],
        });
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
