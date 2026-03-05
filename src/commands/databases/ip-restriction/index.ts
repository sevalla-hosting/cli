import { Command } from 'commander';
import { ipRestrictionGetCommand } from './get.ts';
import { ipRestrictionUpdateCommand } from './update.ts';

export function makeIpRestrictionCommands(): Command {
  const cmd = new Command('ip-restriction').description('Manage IP restrictions');
  cmd.addCommand(ipRestrictionGetCommand);
  cmd.addCommand(ipRestrictionUpdateCommand);
  return cmd;
}
