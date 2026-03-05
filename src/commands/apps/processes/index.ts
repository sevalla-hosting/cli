import { Command } from 'commander';
import { processesListCommand } from './list.ts';
import { processesGetCommand } from './get.ts';
import { processesCreateCommand } from './create.ts';
import { processesUpdateCommand } from './update.ts';
import { processesDeleteCommand } from './delete.ts';
import { processesTriggerCommand } from './trigger.ts';
import { makeProcessMetricsCommands } from './metrics/index.ts';

export function makeProcessesCommands(): Command {
  const cmd = new Command('processes').description('Manage application processes');
  cmd.addCommand(processesListCommand);
  cmd.addCommand(processesGetCommand);
  cmd.addCommand(processesCreateCommand);
  cmd.addCommand(processesUpdateCommand);
  cmd.addCommand(processesDeleteCommand);
  cmd.addCommand(processesTriggerCommand);
  cmd.addCommand(makeProcessMetricsCommands());
  return cmd;
}
