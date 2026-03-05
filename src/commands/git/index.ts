import { Command } from 'commander';
import { gitProvidersCommand } from './providers.ts';

export function makeGitCommand(): Command {
  const cmd = new Command('git').description('Manage git integrations');
  cmd.addCommand(gitProvidersCommand);
  return cmd;
}
