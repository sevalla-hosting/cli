import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { SevallaCliError } from '../../../errors/cli-error.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { validateId } from '../../../helpers/validate.ts';
import { printJson } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

interface ExecResult {
  stdout: string;
  stderr: string;
  exit_code: number;
}

export const processesExecCommand = new Command('exec')
  .description(
    "Run a command in a running process and exit with its exit code. It runs without a shell, so pipes and redirects don't apply",
  )
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .argument('<command...>', 'Command and its arguments; put -- before it when it has flags')
  .option('--timeout <seconds>', 'Seconds to wait for the command, 1-60 (default: 15)')
  .addOption(jsonOption())
  .action(async (processId: string, command: string[], opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(opts['appId'] as string, 'app-id');
      validateId(processId, 'process-id');
      const timeout = opts['timeout'] === undefined ? undefined : Number(opts['timeout']);
      if (timeout !== undefined && !(Number.isInteger(timeout) && timeout >= 1 && timeout <= 60)) {
        throw new SevallaCliError('--timeout must be a whole number of seconds, 1-60.');
      }
      if (!json) startSpinner('Running...');
      const result = await client.request<ExecResult>({
        method: 'POST',
        path: `/applications/${opts['appId']}/processes/${processId}/exec`,
        body: { command, timeout },
        // the command may take up to 60s, longer than the default request timeout
        timeoutMs: ((timeout ?? 15) + 15) * 1000,
      });
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        process.stdout.write(result.stdout);
        process.stderr.write(result.stderr);
      }
      process.exitCode = result.exit_code;
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
