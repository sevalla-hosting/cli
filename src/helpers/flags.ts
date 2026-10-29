import { Option } from 'commander';
import type { QueryParams } from '../client/types.ts';

export function jsonOption(): Option {
  return new Option('--json', 'Output as JSON').default(false);
}

export function confirmOption(): Option {
  return new Option('--confirm', 'Confirm an operation that cannot be undone').default(false);
}

export function paginationOptions(): Option[] {
  return [
    new Option('--page <number>', 'Page number').default(1).argParser(Number),
    new Option('--per-page <number>', 'Items per page').default(25).argParser(Number),
  ];
}

export function metricsOptions(): Option[] {
  return [
    new Option('--from <date>', 'Start date (ISO 8601, default: 24h ago)'),
    new Option('--to <date>', 'End date (ISO 8601, default: now)'),
    new Option('--interval <seconds>', 'Interval in seconds (default: 3600)'),
  ];
}

export function logsOptions(): Option[] {
  return [
    new Option('--from <date>', 'Start of the time range (ISO 8601, default: 1 hour before --to)'),
    new Option('--to <date>', 'End of the time range (ISO 8601, default: now)'),
    new Option('--search <text>', 'Only entries whose message contains this text'),
    new Option(
      '--filters <json>',
      'JSON array of filters, e.g. \'[{"key":"severity","operator":"EQUALS","value":"ERROR"}]\'',
    ),
    new Option('--order <order>', 'Sort order (default: asc)').choices(['asc', 'desc']),
    new Option('--limit <number>', 'Maximum entries, the most recent ones (1-5000, default: 1000)'),
  ];
}

export function logsQuery(opts: Record<string, unknown>): QueryParams {
  const { from, to, search, filters, order, limit } = opts;
  return { from, to, search, filters, order, limit } as QueryParams;
}

export function apiUrlOption(): Option {
  return new Option('--api-url <url>', 'Override API base URL').env('SEVALLA_API_URL');
}

export function resolveJsonMode(opts: Record<string, unknown>): boolean {
  return opts['json'] === true || !process.stdout.isTTY;
}

export function dryRunOption(): Option {
  return new Option('--dry-run', 'Show what would be sent without executing').default(false);
}

export function dataOption(): Option {
  return new Option('--data <json>', 'Raw JSON body to send instead of using flags');
}
