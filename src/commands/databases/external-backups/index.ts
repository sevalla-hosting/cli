import { Command } from 'commander';
import { externalBackupsListCommand } from './list.ts';
import { externalBackupsCreateCommand } from './create.ts';
import { externalBackupsDeleteCommand } from './delete.ts';
import { externalBackupsRestoreCommand } from './restore.ts';
import { externalBackupsDownloadUrlCommand } from './download-url.ts';

export function makeExternalBackupsCommands(): Command {
  const cmd = new Command('external-backups').description(
    'Manage the dump backups stored in backup target buckets',
  );
  cmd.addCommand(externalBackupsListCommand);
  cmd.addCommand(externalBackupsCreateCommand);
  cmd.addCommand(externalBackupsDeleteCommand);
  cmd.addCommand(externalBackupsRestoreCommand);
  cmd.addCommand(externalBackupsDownloadUrlCommand);
  return cmd;
}
