import chalk from 'chalk';
import type { PaginatedResponse } from '../client/types.ts';
import { renderTable, renderKeyValue } from './table.ts';
import type { ColumnDef } from './table.ts';

export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable<T>(response: PaginatedResponse<T> | T[], columns: ColumnDef<T>[]): void {
  const items = Array.isArray(response) ? response : response.data;

  if (items.length === 0) {
    console.log(chalk.dim('No results found.'));
    return;
  }

  console.log(renderTable(items, columns));

  if (!Array.isArray(response) && response.total !== undefined) {
    const offset = response.offset ?? 0;
    const limit = response.limit ?? items.length;
    const start = offset + 1;
    const end = Math.min(offset + limit, response.total);
    console.log(
      chalk.dim(morePagesHint(response) ?? `Showing ${start}-${end} of ${response.total}`),
    );
  }
}

// So a caller seeing one page doesn't conclude that something missing from it doesn't exist
export function morePagesHint<T>(response: PaginatedResponse<T> | T[]): string | null {
  if (Array.isArray(response) || response.total === undefined || response.data.length === 0) {
    return null;
  }
  const offset = response.offset ?? 0;
  const limit = response.limit || response.data.length;
  const end = Math.min(offset + limit, response.total);
  if (end >= response.total) return null;
  const nextPage = Math.floor(offset / limit) + 2;
  return `Showing ${offset + 1}-${end} of ${response.total}. Use --page ${nextPage} for the next page.`;
}

export function printResource(data: Record<string, unknown>): void {
  console.log(renderKeyValue(data));
}

export function printSuccess(message: string): void {
  console.log(chalk.green(`\u2714 ${message}`));
}

export function printWarning(message: string): void {
  console.log(chalk.yellow(`\u26A0 ${message}`));
}

export function printTimeSeries(data: Array<{ time: string; value: number }>, label: string): void {
  if (data.length === 0) {
    console.log(chalk.dim('No metrics data available.'));
    return;
  }

  console.log(chalk.bold(label));
  const columns: ColumnDef<{ time: string; value: number }>[] = [
    { header: 'Time', key: 'time' },
    { header: 'Value', get: (item) => item.value.toString() },
  ];
  console.log(renderTable(data, columns));
}
