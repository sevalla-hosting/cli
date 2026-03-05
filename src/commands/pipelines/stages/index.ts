import { Command } from 'commander';
import { stagesCreateCommand } from './create.ts';
import { stagesDeleteCommand } from './delete.ts';
import { makeStageAppsCommands } from './apps/index.ts';

export function makeStagesCommands(): Command {
  const cmd = new Command('stages').description('Manage pipeline stages');
  cmd.addCommand(stagesCreateCommand);
  cmd.addCommand(stagesDeleteCommand);
  cmd.addCommand(makeStageAppsCommands());
  return cmd;
}
