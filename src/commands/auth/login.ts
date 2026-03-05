import { Command } from 'commander';
import { performDeviceFlow } from '../../auth/device-flow.ts';
import { handleError } from '../../errors/handler.ts';
import { resolveJsonMode } from '../../helpers/flags.ts';
import { isLoggedIn } from '../../auth/token-store.ts';
import { printWarning } from '../../output/formatter.ts';

export function makeLoginCommand(): Command {
  return new Command('login')
    .description('Log in to Sevalla via device authorization')
    .action(async (_opts: Record<string, unknown>, cmd: Command) => {
      const parentOpts = cmd.optsWithGlobals();
      const json = resolveJsonMode(parentOpts);
      try {
        if (isLoggedIn()) {
          printWarning('You are already logged in. Use "sevalla logout" first to switch accounts.');
        }
        await performDeviceFlow(parentOpts['apiUrl'] as string | undefined);
      } catch (error) {
        handleError(error, json);
      }
    });
}
