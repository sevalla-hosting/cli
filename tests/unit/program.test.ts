import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createProgram } from '../../src/program.ts';

async function parseAppsList(args: string[]): Promise<Record<string, unknown>> {
  const program = createProgram();
  const apps = program.commands.find((c) => c.name() === 'apps');
  const list = apps?.commands.find((c) => c.name() === 'list');
  assert.ok(list);
  let seen: Record<string, unknown> = {};
  list.action((opts: Record<string, unknown>) => {
    seen = opts;
  });
  await program.parseAsync(args, { from: 'user' });
  return seen;
}

describe('Program global options', () => {
  it('should pass --json and --api-url given after the subcommand', async () => {
    const opts = await parseAppsList(['apps', 'list', '--json', '--api-url', 'http://a.test']);
    assert.equal(opts['json'], true);
    assert.equal(opts['apiUrl'], 'http://a.test');
  });

  it('should pass --json and --api-url given before the subcommand', async () => {
    const opts = await parseAppsList(['--json', '--api-url', 'http://b.test', 'apps', 'list']);
    assert.equal(opts['json'], true);
    assert.equal(opts['apiUrl'], 'http://b.test');
  });

  it('should leave json off when the flag is not given', async () => {
    const opts = await parseAppsList(['apps', 'list']);
    assert.equal(opts['json'], false);
  });
});
