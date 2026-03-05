import { Option } from 'commander';

export function jsonOption(): Option {
  return new Option('--json', 'Output as JSON').default(false);
}

export function confirmOption(): Option {
  return new Option('--confirm', 'Skip confirmation prompt').default(false);
}

export function paginationOptions(): Option[] {
  return [
    new Option('--page <number>', 'Page number').default(1).argParser(Number),
    new Option('--per-page <number>', 'Items per page').default(25).argParser(Number),
  ];
}

export function metricsOptions(): Option[] {
  return [
    new Option('--from <date>', 'Start date (ISO 8601)'),
    new Option('--to <date>', 'End date (ISO 8601)'),
    new Option('--interval <interval>', 'Time interval (e.g., 1h, 1d)'),
  ];
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
