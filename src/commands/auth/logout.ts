import { Command } from 'commander';
import { clearToken, isLoggedIn } from '../../auth/token-store.ts';
import { printSuccess, printWarning } from '../../output/formatter.ts';

export function makeLogoutCommand(): Command {
  return new Command('logout').description('Log out of Sevalla').action(async () => {
    if (!isLoggedIn()) {
      printWarning('You are not logged in.');
      return;
    }
    clearToken();
    printSuccess('Logged out successfully.');
  });
}
