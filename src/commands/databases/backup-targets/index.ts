import { Command } from 'commander';
import { backupTargetsListCommand } from './list.ts';
import { backupTargetsCreateCommand } from './create.ts';
import { backupTargetsUpdateCommand } from './update.ts';
import { backupTargetsDeleteCommand } from './delete.ts';

export function makeBackupTargetsCommands(): Command {
  const cmd = new Command('backup-targets').description(
    'Manage the S3-compatible buckets that receive dump backups',
  );
  cmd.addCommand(backupTargetsListCommand);
  cmd.addCommand(backupTargetsCreateCommand);
  cmd.addCommand(backupTargetsUpdateCommand);
  cmd.addCommand(backupTargetsDeleteCommand);
  return cmd;
}
