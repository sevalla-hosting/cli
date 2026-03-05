import { Command } from 'commander';
import { deploymentsListCommand } from './list.ts';
import { deploymentsGetCommand } from './get.ts';
import { deploymentsTriggerCommand } from './trigger.ts';
import { deploymentsRollbackCommand } from './rollback.ts';
import { deploymentsCancelCommand } from './cancel.ts';
import { deploymentsLogsCommand } from './logs.ts';

export function makeDeploymentsCommands(): Command {
  const cmd = new Command('deployments').description('Manage application deployments');
  cmd.addCommand(deploymentsListCommand);
  cmd.addCommand(deploymentsGetCommand);
  cmd.addCommand(deploymentsTriggerCommand);
  cmd.addCommand(deploymentsRollbackCommand);
  cmd.addCommand(deploymentsCancelCommand);
  cmd.addCommand(deploymentsLogsCommand);
  return cmd;
}
