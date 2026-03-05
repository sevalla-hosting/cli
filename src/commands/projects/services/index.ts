import { Command } from 'commander';
import { servicesAddCommand } from './add.ts';
import { servicesRemoveCommand } from './remove.ts';

export function makeServicesCommands(): Command {
  const cmd = new Command('services').description('Manage project services');
  cmd.addCommand(servicesAddCommand);
  cmd.addCommand(servicesRemoveCommand);
  return cmd;
}
