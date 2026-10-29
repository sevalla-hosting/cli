import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { processesExecCommand } from '../../../src/commands/apps/processes/exec.ts';
import { processesTerminalCommand } from '../../../src/commands/apps/processes/terminal.ts';

describe('Process exec and terminal commands', () => {
  let fetchMock: ReturnType<typeof mock.fn>;

  beforeEach(() => {
    process.env['SEVALLA_API_TOKEN'] = 'tok';
    fetchMock = mock.fn(
      async () =>
        new Response(JSON.stringify({ stdout: 'out', stderr: '', exit_code: 3 }), { status: 200 }),
    );
    mock.method(globalThis, 'fetch', fetchMock);
    mock.method(process, 'exit', () => {
      throw new Error('exit');
    });
    mock.method(console, 'error', () => {});
    mock.method(console, 'log', () => {});
  });

  afterEach(() => {
    mock.restoreAll();
    process.exitCode = undefined;
  });

  it('should send the command as an argument vector and exit with its exit code', async () => {
    await processesExecCommand.parseAsync(
      ['p1', '--app-id', 'a1', '--timeout', '40', '--json', '--', 'ls', '-la', '/app'],
      { from: 'user' },
    );
    const [url, init] = fetchMock.mock.calls[0]?.arguments as [string, RequestInit];
    assert.match(url, /\/applications\/a1\/processes\/p1\/exec$/);
    assert.deepEqual(JSON.parse(String(init.body)), {
      command: ['ls', '-la', '/app'],
      timeout: 40,
    });
    assert.equal(process.exitCode, 3);
  });

  it('should send no request for an invalid process ID', async () => {
    await assert.rejects(() =>
      processesExecCommand.parseAsync(['p1#', '--app-id', 'a1', '--json', 'ls'], { from: 'user' }),
    );
    assert.equal(fetchMock.mock.callCount(), 0);
  });

  it('should refuse to open a terminal without an interactive shell', () => {
    // node --test runs without a TTY
    assert.throws(() => processesTerminalCommand.parse(['p1', '--app-id', 'a1'], { from: 'user' }));
  });
});
