import { Command } from 'commander';
import { databasesListCommand } from './list.ts';
import { databasesGetCommand } from './get.ts';
import { databasesCreateCommand } from './create.ts';
import { databasesUpdateCommand } from './update.ts';
import { databasesDeleteCommand } from './delete.ts';
import { databasesActivateCommand } from './activate.ts';
import { databasesSuspendCommand } from './suspend.ts';
import { databasesResetPasswordCommand } from './reset-password.ts';
import { makeDatabaseMetricsCommands } from './metrics/index.ts';
import { makeBackupsCommands } from './backups/index.ts';
import { makeConnectionsCommands } from './connections/index.ts';
import { makeIpRestrictionCommands } from './ip-restriction/index.ts';

export function makeDatabasesCommand(): Command {
  const cmd = new Command('databases').description('Manage databases');
  cmd.addCommand(databasesListCommand);
  cmd.addCommand(databasesGetCommand);
  cmd.addCommand(databasesCreateCommand);
  cmd.addCommand(databasesUpdateCommand);
  cmd.addCommand(databasesDeleteCommand);
  cmd.addCommand(databasesActivateCommand);
  cmd.addCommand(databasesSuspendCommand);
  cmd.addCommand(databasesResetPasswordCommand);
  cmd.addCommand(makeDatabaseMetricsCommands());
  cmd.addCommand(makeBackupsCommands());
  cmd.addCommand(makeConnectionsCommands());
  cmd.addCommand(makeIpRestrictionCommands());
  return cmd;
}
