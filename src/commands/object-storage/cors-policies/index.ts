import { Command } from 'commander';
import { corsPoliciesListCommand } from './list.ts';
import { corsPoliciesCreateCommand } from './create.ts';
import { corsPoliciesUpdateCommand } from './update.ts';
import { corsPoliciesDeleteCommand } from './delete.ts';

export function makeCorsPoliciesCommands(): Command {
  const cmd = new Command('cors-policies').description('Manage CORS policies');
  cmd.addCommand(corsPoliciesListCommand);
  cmd.addCommand(corsPoliciesCreateCommand);
  cmd.addCommand(corsPoliciesUpdateCommand);
  cmd.addCommand(corsPoliciesDeleteCommand);
  return cmd;
}
