import Table from 'cli-table3';
import chalk from 'chalk';

export interface ColumnDef<T> {
  header: string;
  key?: keyof T;
  get?: (item: T) => string;
  align?: 'left' | 'center' | 'right';
}

export function renderTable<T>(items: T[], columns: ColumnDef<T>[]): string {
  const table = new Table({
    head: columns.map((c) => chalk.bold(c.header)),
    style: { head: [], border: [] },
  });

  for (const item of items) {
    const row = columns.map((col) => {
      if (col.get) return col.get(item);
      if (col.key) {
        const val = item[col.key];
        return val === null || val === undefined ? '' : String(val);
      }
      return '';
    });
    table.push(row);
  }

  return table.toString();
}

export function renderKeyValue(data: Record<string, unknown>): string {
  const table = new Table({
    style: { head: [], border: [] },
  });

  for (const [key, value] of Object.entries(data)) {
    const displayValue = value === null || value === undefined ? '' : String(value);
    table.push([chalk.cyan(key), displayValue]);
  }

  return table.toString();
}
