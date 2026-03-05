import { Command } from 'commander';
import { accessLogsCommand } from './access.ts';

export function makeLogsCommands(): Command {
  const cmd = new Command('logs').description('Static site logs');
  cmd.addCommand(accessLogsCommand);
  return cmd;
}
