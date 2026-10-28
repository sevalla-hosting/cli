import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Command } from 'commander';
import {
  makeActionCommand,
  makeCreateCommand,
  makeListCommand,
} from '../../../src/helpers/command-factory.ts';
import { envVarColumns, listEnvVars, maskSecrets } from '../../../src/helpers/secrets.ts';
import { morePagesHint } from '../../../src/output/formatter.ts';
import { makeSchemaCommand } from '../../../src/commands/schema.ts';

function capture(): { out: string[]; err: string[] } {
  const out: string[] = [];
  const err: string[] = [];
  mock.method(console, 'log', (...a: unknown[]) => out.push(a.map(String).join(' ')));
  mock.method(console, 'error', (...a: unknown[]) => err.push(a.map(String).join(' ')));
  return { out, err };
}

function mockFetch(body: unknown): string[] {
  const calls: string[] = [];
  mock.method(globalThis, 'fetch', async (url: string) => {
    calls.push(url);
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });
  return calls;
}

function quiet(cmd: Command): Command {
  cmd.exitOverride();
  cmd.configureOutput({ writeErr: () => {}, writeOut: () => {} });
  return cmd;
}

describe('Safety and agent-facing behaviour', () => {
  afterEach(() => mock.restoreAll());

  describe('--confirm on irreversible actions', () => {
    const make = () =>
      quiet(
        makeActionCommand({
          name: 'suspend',
          description: 'Suspend',
          confirm: 'Suspending takes it offline.',
          apiCall: (client, id) => client.post(`/things/${id}/suspend`),
        }),
      );

    it('refuses to call the API without --confirm', async () => {
      const calls = mockFetch({});
      const { err } = capture();
      mock.method(process, 'exit', (code: number) => {
        throw new Error(`exit ${code}`);
      });
      await assert.rejects(make().parseAsync(['abc', '--json'], { from: 'user' }), /exit 1/);
      assert.equal(calls.length, 0);
      assert.match(err.join('\n'), /Suspending takes it offline\. Use --confirm/);
    });

    it('runs with --confirm, and --dry-run needs no --confirm', async () => {
      const calls = mockFetch({});
      capture();
      await make().parseAsync(['abc', '--json', '--confirm'], { from: 'user' });
      assert.equal(calls.length, 1);
      await make().parseAsync(['abc', '--json', '--dry-run'], { from: 'user' });
      assert.equal(calls.length, 1);
    });
  });

  describe('--data', () => {
    const make = () =>
      quiet(
        makeCreateCommand({
          name: 'create',
          description: 'Create',
          options: [
            { flags: '--name <name>', description: 'Name', required: true },
            { flags: '--db-password <password>', description: 'Password', required: true },
          ],
          apiCall: (client, opts) => client.post('/things', { name: opts['name'] }),
          apiPath: '/things',
        }),
      );

    it('works without the flags that are otherwise required', async () => {
      const { out } = capture();
      await make().parseAsync(['--data', '{"name":"x","db_password":"hunter2"}', '--dry-run'], {
        from: 'user',
      });
      const printed = JSON.parse(out.join('\n'));
      assert.deepEqual(printed.body, { name: 'x', db_password: '********' });
    });

    it('cannot be combined with body flags', async () => {
      await assert.rejects(
        make().parseAsync(['--data', '{}', '--name', 'x'], { from: 'user' }),
        /cannot be used with option '--name <name>'/,
      );
    });

    it('still requires the flags when --data is absent', async () => {
      await assert.rejects(
        make().parseAsync(['--name', 'x', '--dry-run'], { from: 'user' }),
        /required option '--db-password <password>' not specified/,
      );
    });

    it('masks secrets in flag-based dry-run output', async () => {
      const { out } = capture();
      await make().parseAsync(['--name', 'x', '--db-password', 'hunter2', '--dry-run'], {
        from: 'user',
      });
      assert.ok(!out.join('\n').includes('hunter2'));
      assert.equal(JSON.parse(out.join('\n')).options.dbPassword, '********');
    });
  });

  it('maskSecrets leaves non-secret keys and non-objects alone', () => {
    assert.deepEqual(maskSecrets({ key: 'K', value: 'v', name: 'n' }), {
      key: 'K',
      value: '********',
      name: 'n',
    });
    assert.deepEqual(maskSecrets([1]), [1]);
  });

  describe('list pagination hint', () => {
    it('is given only when more pages exist', () => {
      const page = (offset: number) => ({ data: [{}], total: 60, offset, limit: 25 });
      assert.equal(morePagesHint(page(0)), 'Showing 1-25 of 60. Use --page 2 for the next page.');
      assert.equal(morePagesHint(page(25)), 'Showing 26-50 of 60. Use --page 3 for the next page.');
      assert.equal(morePagesHint(page(50)), null);
      assert.equal(morePagesHint([{}]), null);
    });

    it('goes to stderr in JSON mode, keeping stdout a plain array', async () => {
      mockFetch({ data: [{ id: '1' }], total: 30, offset: 0, limit: 1 });
      const { out, err } = capture();
      const cmd = quiet(
        makeListCommand({
          name: 'list',
          description: 'List',
          columns: [{ header: 'ID', key: 'id' }],
          apiCall: (client) => client.get('/things'),
        }),
      );
      await cmd.parseAsync(['--json', '--per-page', '1'], { from: 'user' });
      assert.deepEqual(JSON.parse(out.join('\n')), [{ id: '1' }]);
      assert.match(err.join('\n'), /Use --page 2/);
    });
  });

  describe('env var values', () => {
    const res = { data: [{ id: '1', key: 'K', value: 'secret' }], total: 1 };

    it('are hidden unless --show-values is given', async () => {
      mockFetch(res);
      const { createClient } = await import('../../../src/client/api-client.ts');
      const client = createClient({ apiUrl: 'https://example.test' });
      const hidden = await listEnvVars(client, '/env', {});
      assert.deepEqual(hidden.data, [{ id: '1', key: 'K' }]);
      assert.equal(envVarColumns[2]?.get?.(hidden.data[0] ?? {}), '(hidden)');
      const shown = await listEnvVars(client, '/env', { showValues: true });
      assert.equal(shown.data[0]?.['value'], 'secret');
    });
  });

  it('schema says which options are mandatory and which take a value', async () => {
    const program = new Command('sevalla');
    program.addCommand(
      new Command('create')
        .requiredOption('--name <name>', 'Name')
        .option('--branch <branch>', 'Branch')
        .option('--restart', 'Restart'),
    );
    program.addCommand(makeSchemaCommand(program));
    const { out } = capture();
    await program.parseAsync(['schema', 'create'], { from: 'user' });
    const opts = JSON.parse(out.join('\n')).options as Array<Record<string, unknown>>;
    const by = (long: string) => opts.find((o) => o['long'] === long);
    assert.deepEqual(
      [by('--name'), by('--branch'), by('--restart')].map((o) => [
        o?.['mandatory'],
        o?.['takesValue'],
      ]),
      [
        [true, true],
        [false, true],
        [false, false],
      ],
    );
    assert.ok(!('required' in (by('--name') ?? {})));
  });
});
