import { Command } from 'commander';
import { privatePortsListCommand } from './list.ts';
import { privatePortsCreateCommand } from './create.ts';
import { privatePortsDeleteCommand } from './delete.ts';

export function makePrivatePortsCommands(): Command {
  const cmd = new Command('private-ports').description('Manage private ports');
  cmd.addCommand(privatePortsListCommand);
  cmd.addCommand(privatePortsCreateCommand);
  cmd.addCommand(privatePortsDeleteCommand);
  return cmd;
}
