import { Command } from 'commander';
import { destinationsListCommand } from './list.ts';
import { destinationsCreateCommand } from './create.ts';
import { destinationsDeleteCommand } from './delete.ts';
import { destinationsToggleCommand } from './toggle.ts';

export function makeDestinationsCommands(): Command {
  const cmd = new Command('destinations').description('Manage load balancer destinations');
  cmd.addCommand(destinationsListCommand);
  cmd.addCommand(destinationsCreateCommand);
  cmd.addCommand(destinationsDeleteCommand);
  cmd.addCommand(destinationsToggleCommand);
  return cmd;
}
