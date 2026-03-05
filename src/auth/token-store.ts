import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { CONFIG_DIR, CREDENTIALS_FILE } from '../helpers/config.ts';

interface Credentials {
  token: string;
}

export type TokenSource = 'environment' | 'credentials_file' | null;

export function getToken(): string | null {
  const envToken = process.env['SEVALLA_API_TOKEN'];
  if (envToken) return envToken;
  try {
    if (!existsSync(CREDENTIALS_FILE)) return null;
    const raw = readFileSync(CREDENTIALS_FILE, 'utf-8');
    const creds = JSON.parse(raw) as Credentials;
    return creds.token ?? null;
  } catch {
    return null;
  }
}

export function getTokenSource(): TokenSource {
  if (process.env['SEVALLA_API_TOKEN']) return 'environment';
  try {
    if (!existsSync(CREDENTIALS_FILE)) return null;
    const raw = readFileSync(CREDENTIALS_FILE, 'utf-8');
    const creds = JSON.parse(raw) as Credentials;
    if (creds.token) return 'credentials_file';
    return null;
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  const data: Credentials = { token };
  writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2) + '\n', {
    mode: 0o600,
  });
}

export function clearToken(): void {
  try {
    if (existsSync(CREDENTIALS_FILE)) {
      unlinkSync(CREDENTIALS_FILE);
    }
  } catch {
    // ignore errors
  }
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}
