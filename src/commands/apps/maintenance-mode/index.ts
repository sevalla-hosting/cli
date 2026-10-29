import { Command } from 'commander';
import { maintenanceModeGetCommand } from './get.ts';
import { maintenanceModeUpdateCommand } from './update.ts';

export function makeMaintenanceModeCommands(): Command {
  const cmd = new Command('maintenance-mode').description('Manage maintenance mode');
  cmd.addCommand(maintenanceModeGetCommand);
  cmd.addCommand(maintenanceModeUpdateCommand);
  return cmd;
}
