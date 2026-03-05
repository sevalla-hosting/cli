import { Command } from 'commander';
import { deploymentHookGetCommand } from './get.ts';
import { deploymentHookEnableCommand } from './enable.ts';
import { deploymentHookRegenerateCommand } from './regenerate.ts';
import { deploymentHookDisableCommand } from './disable.ts';

export function makeDeploymentHookCommands(): Command {
  const cmd = new Command('deployment-hook').description('Manage deployment hooks');
  cmd.addCommand(deploymentHookGetCommand);
  cmd.addCommand(deploymentHookEnableCommand);
  cmd.addCommand(deploymentHookRegenerateCommand);
  cmd.addCommand(deploymentHookDisableCommand);
  return cmd;
}
