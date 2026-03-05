import { Command } from 'commander';
import { staticSitesListCommand } from './list.ts';
import { staticSitesGetCommand } from './get.ts';
import { staticSitesCreateCommand } from './create.ts';
import { staticSitesUpdateCommand } from './update.ts';
import { staticSitesDeleteCommand } from './delete.ts';
import { staticSitesPurgeCacheCommand } from './purge-cache.ts';
import { makeDeploymentsCommands } from './deployments/index.ts';
import { makeDomainsCommands } from './domains/index.ts';
import { makeEnvVarsCommands } from './env-vars/index.ts';
import { makeLogsCommands } from './logs/index.ts';
import { makeStaticSiteMetricsCommands } from './metrics/index.ts';

export function makeStaticSitesCommand(): Command {
  const cmd = new Command('static-sites').description('Manage static sites');
  cmd.addCommand(staticSitesListCommand);
  cmd.addCommand(staticSitesGetCommand);
  cmd.addCommand(staticSitesCreateCommand);
  cmd.addCommand(staticSitesUpdateCommand);
  cmd.addCommand(staticSitesDeleteCommand);
  cmd.addCommand(staticSitesPurgeCacheCommand);
  cmd.addCommand(makeDeploymentsCommands());
  cmd.addCommand(makeDomainsCommands());
  cmd.addCommand(makeEnvVarsCommands());
  cmd.addCommand(makeLogsCommands());
  cmd.addCommand(makeStaticSiteMetricsCommands());
  return cmd;
}
