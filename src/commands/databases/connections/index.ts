import { Command } from 'commander';
import { internalConnectionsListCommand } from './internal-list.ts';
import { internalConnectionsCreateCommand } from './internal-create.ts';
import { internalConnectionsDeleteCommand } from './internal-delete.ts';
import { externalConnectionToggleCommand } from './external-toggle.ts';

export function makeConnectionsCommands(): Command {
  const cmd = new Command('connections').description('Manage database connections');
  cmd.addCommand(internalConnectionsListCommand);
  cmd.addCommand(internalConnectionsCreateCommand);
  cmd.addCommand(internalConnectionsDeleteCommand);
  cmd.addCommand(externalConnectionToggleCommand);
  return cmd;
}
