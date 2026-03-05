import { Command } from 'commander';
import { objectsListCommand } from './list.ts';
import { objectsDeleteCommand } from './delete.ts';

export function makeObjectsCommands(): Command {
  const cmd = new Command('objects').description('Manage bucket objects');
  cmd.addCommand(objectsListCommand);
  cmd.addCommand(objectsDeleteCommand);
  return cmd;
}
