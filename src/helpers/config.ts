import { homedir } from 'node:os';
import { join } from 'node:path';

export const DEFAULT_BASE_URL = 'https://api.sevalla.com/v3';
export const CONFIG_DIR = join(homedir(), '.config', 'sevalla');
export const CREDENTIALS_FILE = join(CONFIG_DIR, 'credentials.json');
export const AUTHORIZE_URL = 'https://app.sevalla.com/authorize';

export function getBaseUrl(overrideUrl?: string): string {
  return overrideUrl ?? process.env['SEVALLA_API_URL'] ?? DEFAULT_BASE_URL;
}

declare const __CLI_VERSION__: string | undefined;

export function getVersion(): string {
  if (typeof __CLI_VERSION__ !== 'undefined') return __CLI_VERSION__;
  return process.env['npm_package_version'] ?? '0.0.0-dev';
}
