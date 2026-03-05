import { Command } from 'commander';
import { runtimeLogsCommand } from './runtime.ts';
import { accessLogsCommand } from './access.ts';

export function makeLogsCommands(): Command {
  const cmd = new Command('logs').description('Application logs');
  cmd.addCommand(runtimeLogsCommand);
  cmd.addCommand(accessLogsCommand);
  return cmd;
}
