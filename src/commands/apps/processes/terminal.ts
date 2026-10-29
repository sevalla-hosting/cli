import { Command, Option } from 'commander';
import { getToken } from '../../../auth/token-store.ts';
import { SevallaCliError } from '../../../errors/cli-error.ts';
import { handleError } from '../../../errors/handler.ts';
import { getBaseUrl } from '../../../helpers/config.ts';
import { validateId } from '../../../helpers/validate.ts';

const CLOSE_REASONS: Record<number, string | undefined> = {
  1006: "Couldn't connect. Check the IDs and that your API key can access the application.",
  4000: 'Application or process not found.',
  4001: 'No running instance of the process to connect to.',
  4002: 'The shell stream failed.',
  4004: 'Closed after 8 hours without input or output.',
  4005: "Couldn't connect to the instance.",
  4300: 'Unexpected server error.',
};

export const processesTerminalCommand = new Command('terminal')
  .description('Open an interactive shell in a running process')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<process-id>', 'Process ID')
  .addOption(
    new Option('--shell <shell>', 'Shell to start')
      .choices(['sh', 'bash', 'dash', 'ksh', 'zsh', 'csh', 'tcsh'])
      .default('sh'),
  )
  .action((processId: string, opts: Record<string, unknown>) => {
    try {
      validateId(opts['appId'] as string, 'app-id');
      validateId(processId, 'process-id');
      if (!process.stdin.isTTY || !process.stdout.isTTY) {
        throw new SevallaCliError(
          'The terminal needs an interactive shell. Use `apps processes exec` to run a single command.',
        );
      }
      const token = getToken();
      if (!token) throw new SevallaCliError('Not logged in. Run "sevalla login" to authenticate.');

      const url = new URL(
        `${getBaseUrl(opts['apiUrl'] as string | undefined)}/applications/${opts['appId']}/processes/${processId}/terminal`,
      );
      url.protocol = url.protocol === 'http:' ? 'ws:' : 'wss:';
      url.searchParams.set('shell', opts['shell'] as string);
      // Some terminals report 0x0; without the params the server starts at 80x24
      if (process.stdout.columns) url.searchParams.set('cols', String(process.stdout.columns));
      if (process.stdout.rows) url.searchParams.set('rows', String(process.stdout.rows));

      // Node and Bun both accept headers here, unlike browsers
      const ws = new WebSocket(url, { headers: { Authorization: `Bearer ${token}` } });
      // Resize messages go as binary; text messages are always shell input
      const resize = (): void =>
        ws.send(
          new TextEncoder().encode(
            JSON.stringify({
              type: 'resize',
              cols: process.stdout.columns,
              rows: process.stdout.rows,
            }),
          ),
        );

      ws.addEventListener('open', () => {
        process.stdin.setRawMode(true);
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (data: string) => ws.send(data));
        process.stdout.on('resize', resize);
      });
      ws.addEventListener('message', (event) => {
        process.stdout.write(String(event.data));
      });
      ws.addEventListener('close', (event) => {
        if (process.stdin.isRaw) process.stdin.setRawMode(false);
        // 4003: the shell exited
        if ([1000, 1005, 4003].includes(event.code)) process.exit(0);
        console.error(`\n${CLOSE_REASONS[event.code] ?? `Connection closed (${event.code}).`}`);
        process.exit(1);
      });
    } catch (error) {
      handleError(error, false);
    }
  });
