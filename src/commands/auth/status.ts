import { Command } from 'commander';
import { getTokenSource } from '../../auth/token-store.ts';
import { createClient } from '../../client/api-client.ts';
import { SevallaApiError } from '../../errors/api-error.ts';
import { handleError } from '../../errors/handler.ts';
import { printJson, printSuccess } from '../../output/formatter.ts';
import { jsonOption, resolveJsonMode } from '../../helpers/flags.ts';
import chalk from 'chalk';

export function makeAuthStatusCommand(): Command {
  const cmd = new Command('status')
    .description('Show current authentication status (checks the token with the API)')
    .addOption(jsonOption());

  cmd.action(async (opts: Record<string, unknown>) => {
    const json = resolveJsonMode(opts);
    const source = getTokenSource();
    let rejected = false;
    if (source) {
      // A stored token can be revoked or expired, so ask the API rather than trusting it exists
      try {
        await createClient({ apiUrl: opts['apiUrl'] as string | undefined }).get(
          '/api-keys/validate',
        );
      } catch (error) {
        if (!(error instanceof SevallaApiError && error.status === 401)) handleError(error, json);
        rejected = true;
      }
    }
    const loggedIn = source !== null && !rejected;

    if (json) {
      printJson({ logged_in: loggedIn, source, ...(rejected && { token_rejected: true }) });
    } else if (loggedIn) {
      printSuccess(`Authenticated (source: ${source})`);
    } else if (rejected) {
      console.log(
        chalk.yellow(
          `The token from ${source} was rejected (revoked or expired). Run "sevalla login" or set a valid SEVALLA_API_TOKEN.`,
        ),
      );
    } else {
      console.log(chalk.yellow('Not logged in. Run "sevalla login" to authenticate.'));
    }
  });

  return cmd;
}
