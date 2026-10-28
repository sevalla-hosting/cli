import { Option } from 'commander';
import type { ApiClient } from '../client/api-client.ts';
import type { PaginatedResponse } from '../client/types.ts';
import type { ColumnDef } from '../output/table.ts';

type Item = Record<string, unknown>;

// Keys whose values dry-run output must not echo back (`value` is an env var value)
const SECRET_KEY = /password|secret|^value$/i;

export function maskSecrets(body: unknown): unknown {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return body;
  return Object.fromEntries(
    Object.entries(body).map(([k, v]) => [
      k,
      SECRET_KEY.test(k) && v !== undefined ? '********' : v,
    ]),
  );
}

// The API returns env var values decrypted, so they stay out of output unless asked for
export function omitValue({ value: _value, ...rest }: Item): Item {
  return rest;
}

export function showValuesOption(): Option {
  return new Option('--show-values', 'Include variable values (returned decrypted)').default(false);
}

export const envVarColumns: ColumnDef<Item>[] = [
  { header: 'ID', key: 'id' },
  { header: 'Key', key: 'key' },
  { header: 'Value', get: (item) => ('value' in item ? String(item['value']) : '(hidden)') },
];

export async function listEnvVars(
  client: ApiClient,
  path: string,
  opts: Record<string, unknown>,
): Promise<PaginatedResponse<Item>> {
  const res = await client.get<PaginatedResponse<Item>>(path);
  return opts['showValues'] ? res : { ...res, data: res.data.map(omitValue) };
}
