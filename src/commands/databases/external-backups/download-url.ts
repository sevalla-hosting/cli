import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { validateId } from '../../../helpers/validate.ts';
import { printJson } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const externalBackupsDownloadUrlCommand = new Command('download-url')
  .description('Get a download URL for a dump backup, valid for 2 minutes')
  .argument('<db-id>', 'Database ID')
  .argument('<backup-id>', 'External backup ID')
  .addOption(jsonOption())
  .action(async (dbId: string, backupId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(dbId, 'db-id');
      validateId(backupId, 'backup-id');
      if (!json) startSpinner('Fetching...');
      const result = await client.get<{ url: string; expires_at: string }>(
        `/databases/${dbId}/external-backups/${backupId}/download-url`,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        console.log(result.url);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
