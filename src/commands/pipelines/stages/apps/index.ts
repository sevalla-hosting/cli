import { Command } from 'commander';
import { stageAppsAddCommand } from './add.ts';
import { stageAppsRemoveCommand } from './remove.ts';

export function makeStageAppsCommands(): Command {
  const cmd = new Command('apps').description('Manage pipeline stage applications');
  cmd.addCommand(stageAppsAddCommand);
  cmd.addCommand(stageAppsRemoveCommand);
  return cmd;
}
