import { Command } from 'commander';
import { processesListCommand } from './list.ts';
import { processesGetCommand } from './get.ts';
import { processesCreateCommand } from './create.ts';
import { processesUpdateCommand } from './update.ts';
import { processesDeleteCommand } from './delete.ts';
import { processesTriggerCommand } from './trigger.ts';
import { processesRunsCommand } from './runs.ts';
import { processesExecCommand } from './exec.ts';
import { processesTerminalCommand } from './terminal.ts';
import { makeProcessMetricsCommands } from './metrics/index.ts';
import { makeProcessDiskCommands } from './disk/index.ts';

export function makeProcessesCommands(): Command {
  const cmd = new Command('processes').description('Manage application processes');
  cmd.addCommand(processesListCommand);
  cmd.addCommand(processesGetCommand);
  cmd.addCommand(processesCreateCommand);
  cmd.addCommand(processesUpdateCommand);
  cmd.addCommand(processesDeleteCommand);
  cmd.addCommand(processesTriggerCommand);
  cmd.addCommand(processesRunsCommand);
  cmd.addCommand(processesExecCommand);
  cmd.addCommand(processesTerminalCommand);
  cmd.addCommand(makeProcessMetricsCommands());
  cmd.addCommand(makeProcessDiskCommands());
  return cmd;
}
