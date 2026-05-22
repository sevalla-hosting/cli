import { Command } from 'commander';
import { resourcesClustersCommand } from './clusters.ts';
import { resourcesDbTypesCommand } from './db-types.ts';
import { resourcesProcessTypesCommand } from './process-types.ts';
import { resourcesRbacPermissionsCommand } from './rbac-permissions.ts';
import { resourcesRbacRolesCommand } from './rbac-roles.ts';

export function makeResourcesCommand(): Command {
  const cmd = new Command('resources').description('List available resources');
  cmd.addCommand(resourcesClustersCommand);
  cmd.addCommand(resourcesDbTypesCommand);
  cmd.addCommand(resourcesProcessTypesCommand);
  cmd.addCommand(resourcesRbacPermissionsCommand);
  cmd.addCommand(resourcesRbacRolesCommand);
  return cmd;
}
