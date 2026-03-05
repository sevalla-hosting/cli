import { Command } from 'commander';
import { deliveriesListCommand } from './list.ts';
import { deliveriesGetCommand } from './get.ts';

export function makeDeliveriesCommands(): Command {
  const cmd = new Command('deliveries').description('Manage webhook deliveries');
  cmd.addCommand(deliveriesListCommand);
  cmd.addCommand(deliveriesGetCommand);
  return cmd;
}
