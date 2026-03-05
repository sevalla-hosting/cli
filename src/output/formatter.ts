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

  if (!Array.isArray(response) && response.pagination) {
    const { page, per_page, total } = response.pagination;
    const start = (page - 1) * per_page + 1;
    const end = Math.min(page * per_page, total);
    console.log(chalk.dim(`Showing ${start}-${end} of ${total}`));
  }
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
