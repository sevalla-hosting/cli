import { Command } from 'commander';
import { domainsListCommand } from './list.ts';
import { domainsGetCommand } from './get.ts';
import { domainsAddCommand } from './add.ts';
import { domainsUpdateCommand } from './update.ts';
import { domainsDeleteCommand } from './delete.ts';
import { domainsRefreshStatusCommand } from './refresh-status.ts';
import { domainsSetPrimaryCommand } from './set-primary.ts';
import { domainsToggleCommand } from './toggle.ts';

export function makeDomainsCommands(): Command {
  const cmd = new Command('domains').description('Manage static site domains');
  cmd.addCommand(domainsListCommand);
  cmd.addCommand(domainsGetCommand);
  cmd.addCommand(domainsAddCommand);
  cmd.addCommand(domainsUpdateCommand);
  cmd.addCommand(domainsDeleteCommand);
  cmd.addCommand(domainsRefreshStatusCommand);
  cmd.addCommand(domainsSetPrimaryCommand);
  cmd.addCommand(domainsToggleCommand);
  return cmd;
}
