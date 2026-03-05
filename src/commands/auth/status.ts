import { Command } from 'commander';
import { isLoggedIn, getTokenSource } from '../../auth/token-store.ts';
import { printJson, printSuccess } from '../../output/formatter.ts';
import { jsonOption, resolveJsonMode } from '../../helpers/flags.ts';
import chalk from 'chalk';

export function makeAuthStatusCommand(): Command {
  const cmd = new Command('status')
    .description('Show current authentication status')
    .addOption(jsonOption());

  cmd.action(async (opts: Record<string, unknown>) => {
    const json = resolveJsonMode(opts);
    const loggedIn = isLoggedIn();
    const source = getTokenSource();
    if (json) {
      printJson({ logged_in: loggedIn, source });
    } else if (loggedIn) {
      printSuccess(`Authenticated (source: ${source})`);
    } else {
      console.log(chalk.yellow('Not logged in. Run "sevalla login" to authenticate.'));
    }
  });

  return cmd;
}
