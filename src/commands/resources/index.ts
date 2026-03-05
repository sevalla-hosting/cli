import { Command } from 'commander';
import { resourcesClustersCommand } from './clusters.ts';
import { resourcesDbTypesCommand } from './db-types.ts';
import { resourcesProcessTypesCommand } from './process-types.ts';

export function makeResourcesCommand(): Command {
  const cmd = new Command('resources').description('List available resources');
  cmd.addCommand(resourcesClustersCommand);
  cmd.addCommand(resourcesDbTypesCommand);
  cmd.addCommand(resourcesProcessTypesCommand);
  return cmd;
}
