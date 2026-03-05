import { Command } from 'commander';
import { loadBalancersListCommand } from './list.ts';
import { loadBalancersGetCommand } from './get.ts';
import { loadBalancersCreateCommand } from './create.ts';
import { loadBalancersUpdateCommand } from './update.ts';
import { loadBalancersDeleteCommand } from './delete.ts';
import { makeDestinationsCommands } from './destinations/index.ts';
import { makeLbDomainsCommands } from './domains/index.ts';

export function makeLoadBalancersCommand(): Command {
  const cmd = new Command('load-balancers').description('Manage load balancers');
  cmd.addCommand(loadBalancersListCommand);
  cmd.addCommand(loadBalancersGetCommand);
  cmd.addCommand(loadBalancersCreateCommand);
  cmd.addCommand(loadBalancersUpdateCommand);
  cmd.addCommand(loadBalancersDeleteCommand);
  cmd.addCommand(makeDestinationsCommands());
  cmd.addCommand(makeLbDomainsCommands());
  return cmd;
}
