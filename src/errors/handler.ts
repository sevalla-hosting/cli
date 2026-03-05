import chalk from 'chalk';
import { SevallaApiError } from './api-error.ts';
import { SevallaCliError } from './cli-error.ts';

export function handleError(error: unknown, json: boolean): never {
  if (error instanceof SevallaApiError) {
    if (json) {
      console.error(JSON.stringify(error.toJSON(), null, 2));
    } else {
      console.error(chalk.red(`Error ${error.status}: ${error.message}`));
      if (error.data?.code) {
        console.error(chalk.dim(`Code: ${error.data.code}`));
      }
      if (error.data?.message) {
        console.error(chalk.dim(error.data.message));
      }
    }
    process.exit(1);
  }

  if (error instanceof SevallaCliError) {
    if (json) {
      console.error(JSON.stringify(error.toJSON(), null, 2));
    } else {
      console.error(chalk.red(error.message));
    }
    process.exit(error.exitCode);
  }

  if (json) {
    console.error(JSON.stringify({ error: { message: String(error) } }, null, 2));
  } else {
    console.error(
      chalk.red(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`),
    );
  }
  process.exit(1);
}
