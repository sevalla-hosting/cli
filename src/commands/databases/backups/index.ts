import { Command } from 'commander';
import { backupsListCommand } from './list.ts';
import { backupsCreateCommand } from './create.ts';
import { backupsDeleteCommand } from './delete.ts';
import { backupsRestoreCommand } from './restore.ts';

export function makeBackupsCommands(): Command {
  const cmd = new Command('backups').description('Manage database backups');
  cmd.addCommand(backupsListCommand);
  cmd.addCommand(backupsCreateCommand);
  cmd.addCommand(backupsDeleteCommand);
  cmd.addCommand(backupsRestoreCommand);
  return cmd;
}
