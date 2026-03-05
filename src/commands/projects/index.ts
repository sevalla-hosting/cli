import { Command } from 'commander';
import { projectsListCommand } from './list.ts';
import { projectsGetCommand } from './get.ts';
import { projectsCreateCommand } from './create.ts';
import { projectsUpdateCommand } from './update.ts';
import { projectsDeleteCommand } from './delete.ts';
import { makeServicesCommands } from './services/index.ts';

export function makeProjectsCommand(): Command {
  const cmd = new Command('projects').description('Manage projects');
  cmd.addCommand(projectsListCommand);
  cmd.addCommand(projectsGetCommand);
  cmd.addCommand(projectsCreateCommand);
  cmd.addCommand(projectsUpdateCommand);
  cmd.addCommand(projectsDeleteCommand);
  cmd.addCommand(makeServicesCommands());
  return cmd;
}
