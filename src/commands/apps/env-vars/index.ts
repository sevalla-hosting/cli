import { Command } from 'commander';
import { envVarsListCommand } from './list.ts';
import { envVarsCreateCommand } from './create.ts';
import { envVarsUpdateCommand } from './update.ts';
import { envVarsDeleteCommand } from './delete.ts';

export function makeEnvVarsCommands(): Command {
  const cmd = new Command('env-vars').description('Manage environment variables');
  cmd.addCommand(envVarsListCommand);
  cmd.addCommand(envVarsCreateCommand);
  cmd.addCommand(envVarsUpdateCommand);
  cmd.addCommand(envVarsDeleteCommand);
  return cmd;
}
