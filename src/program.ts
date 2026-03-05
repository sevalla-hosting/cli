import { Command } from 'commander';
import { getVersion } from './helpers/config.ts';
import { apiUrlOption, jsonOption } from './helpers/flags.ts';
import { makeLoginCommand } from './commands/auth/login.ts';
import { makeLogoutCommand } from './commands/auth/logout.ts';
import { makeAuthStatusCommand } from './commands/auth/status.ts';
import { makeAppsCommand } from './commands/apps/index.ts';
import { makeDatabasesCommand } from './commands/databases/index.ts';
import { makeStaticSitesCommand } from './commands/static-sites/index.ts';
import { makeLoadBalancersCommand } from './commands/load-balancers/index.ts';
import { makeObjectStorageCommand } from './commands/object-storage/index.ts';
import { makePipelinesCommand } from './commands/pipelines/index.ts';
import { makeDockerRegistriesCommand } from './commands/docker-registries/index.ts';
import { makeWebhooksCommand } from './commands/webhooks/index.ts';
import { makeProjectsCommand } from './commands/projects/index.ts';
import { makeApiKeysCommand } from './commands/api-keys/index.ts';
import { makeResourcesCommand } from './commands/resources/index.ts';
import { makeGlobalEnvVarsCommand } from './commands/global-env-vars/index.ts';
import { makeGitCommand } from './commands/git/index.ts';
import { makeUsersCommand } from './commands/users/index.ts';
import { makeSchemaCommand } from './commands/schema.ts';
import { makeCompletionCommand, makeCompleteCommand } from './commands/completion.ts';

export function createProgram(): Command {
  const program = new Command('sevalla')
    .version(getVersion())
    .description('Official CLI for the Sevalla cloud platform')
    .addOption(apiUrlOption())
    .addOption(jsonOption());

  // Auth commands (top-level)
  program.addCommand(makeLoginCommand());
  program.addCommand(makeLogoutCommand());

  const auth = new Command('auth').description('Authentication management');
  auth.addCommand(makeAuthStatusCommand());
  program.addCommand(auth);

  // Resource commands
  program.addCommand(makeAppsCommand());
  program.addCommand(makeDatabasesCommand());
  program.addCommand(makeStaticSitesCommand());
  program.addCommand(makeLoadBalancersCommand());
  program.addCommand(makeObjectStorageCommand());
  program.addCommand(makePipelinesCommand());
  program.addCommand(makeDockerRegistriesCommand());
  program.addCommand(makeWebhooksCommand());
  program.addCommand(makeProjectsCommand());
  program.addCommand(makeApiKeysCommand());
  program.addCommand(makeResourcesCommand());
  program.addCommand(makeGlobalEnvVarsCommand());
  program.addCommand(makeGitCommand());
  program.addCommand(makeUsersCommand());

  // Completion
  program.addCommand(makeCompletionCommand());

  // Schema must be added last so it can introspect all commands
  program.addCommand(makeSchemaCommand(program));

  // Hidden internal command for dynamic completions (must be after all commands are added)
  program.addCommand(makeCompleteCommand(program), { hidden: true });

  return program;
}
