import { Command } from 'commander';
import { globalEnvVarsListCommand } from './list.ts';
import { globalEnvVarsCreateCommand } from './create.ts';
import { globalEnvVarsUpdateCommand } from './update.ts';
import { globalEnvVarsDeleteCommand } from './delete.ts';

export function makeGlobalEnvVarsCommand(): Command {
  const cmd = new Command('global-env-vars').description('Manage global environment variables');
  cmd.addCommand(globalEnvVarsListCommand);
  cmd.addCommand(globalEnvVarsCreateCommand);
  cmd.addCommand(globalEnvVarsUpdateCommand);
  cmd.addCommand(globalEnvVarsDeleteCommand);
  return cmd;
}
