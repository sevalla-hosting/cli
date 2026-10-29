import { Command } from 'commander';
import { internalConnectionsListCommand } from './list.ts';
import { internalConnectionsCreateCommand } from './create.ts';
import { internalConnectionsDeleteCommand } from './delete.ts';

export function makeInternalConnectionsCommands(): Command {
  const cmd = new Command('internal-connections').description(
    'Manage private network connections to other applications and databases',
  );
  cmd.addCommand(internalConnectionsListCommand);
  cmd.addCommand(internalConnectionsCreateCommand);
  cmd.addCommand(internalConnectionsDeleteCommand);
  return cmd;
}
