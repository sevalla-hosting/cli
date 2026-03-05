import chalk from 'chalk';
import open from 'open';
import { ApiClient } from '../client/api-client.ts';
import { saveToken } from './token-store.ts';
import { AUTHORIZE_URL, getBaseUrl } from '../helpers/config.ts';
import { SevallaCliError } from '../errors/cli-error.ts';
import { startSpinner, succeedSpinner, failSpinner } from '../output/spinner.ts';

interface DeviceCode {
  code: string;
  expires_at: string;
}

interface DeviceCodeStatus {
  status: 'pending' | 'approved' | 'denied' | 'expired';
  token?: string;
}

const POLL_INTERVAL_MS = 5_000;

export async function performDeviceFlow(apiUrl?: string): Promise<void> {
  const client = new ApiClient({ baseUrl: apiUrl ? apiUrl : getBaseUrl() });

  // Step 1: Create device code
  const { code, expires_at } = await client.post<DeviceCode>('/auth/device-codes');

  // Step 2: Display code and open browser
  console.log();
  console.log(chalk.bold('Your device code is:'));
  console.log();
  console.log(`  ${chalk.cyan.bold(code)}`);
  console.log();

  const authorizeUrl = `${AUTHORIZE_URL}?code=${code}`;
  console.log(chalk.dim(`Opening ${authorizeUrl} in your browser...`));
  console.log(chalk.dim('If the browser does not open, visit the URL above manually.'));
  console.log();

  try {
    await open(authorizeUrl);
  } catch {
    // Browser open failed, user can do it manually
  }

  // Step 3: Poll for approval
  const expiresAt = new Date(expires_at).getTime();
  startSpinner('Waiting for authorization...');

  while (Date.now() < expiresAt) {
    await sleep(POLL_INTERVAL_MS);

    try {
      const result = await client.get<DeviceCodeStatus>(`/auth/device-codes/${code}`);

      switch (result.status) {
        case 'approved':
          if (!result.token) {
            failSpinner('Authorization failed');
            throw new SevallaCliError('Approved but no token received');
          }
          saveToken(result.token);
          succeedSpinner('Successfully logged in!');
          return;

        case 'denied':
          failSpinner('Authorization denied');
          throw new SevallaCliError('Authorization request was denied');

        case 'expired':
          failSpinner('Device code expired');
          throw new SevallaCliError('Device code expired. Please try again.');

        case 'pending':
          // Continue polling
          break;
      }
    } catch (error) {
      if (error instanceof SevallaCliError) throw error;
      // Network errors during polling - continue
    }
  }

  failSpinner('Device code expired');
  throw new SevallaCliError('Device code expired. Please try again.');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
