import { Command } from 'commander';
import { processDiskUpdateCommand } from './update.ts';
import { processDiskDeleteCommand } from './delete.ts';

export function makeProcessDiskCommands(): Command {
  const cmd = new Command('disk').description('Manage the disk of a process');
  cmd.addCommand(processDiskUpdateCommand);
  cmd.addCommand(processDiskDeleteCommand);
  return cmd;
}
