import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { sevalla, sevallaRaw } from '../helpers/cli.ts'

describe('common / cross-cutting concerns', () => {
  // ---------------------------------------------------------------------------
  // Auth guard – requests without a token should fail
  // ---------------------------------------------------------------------------
  it('should reject unauthenticated requests (no token)', async () => {
    const res = await sevalla(['apps', 'list'], { env: { SEVALLA_API_TOKEN: '' } })
    assert.equal(res.exitCode, 1, 'expected non-zero exit when token is missing')
  })

  // ---------------------------------------------------------------------------
  // Auth status – verify the CLI reports authentication state correctly
  // ---------------------------------------------------------------------------
  it('sevalla auth status should report logged_in via environment', async () => {
    const res = await sevalla(['auth', 'status'])
    assert.equal(res.exitCode, 0)
    const body = res.json<{ logged_in: boolean; source: string }>()
    assert.equal(body.logged_in, true)
    assert.equal(body.source, 'environment')
  })

  // ---------------------------------------------------------------------------
  // Schema – full tree
  // ---------------------------------------------------------------------------
  it('sevalla schema should return the full command tree', async () => {
    const res = await sevalla(['schema'])
    assert.equal(res.exitCode, 0)
    const body = res.json<{ name: string; subcommands: unknown[] }>()
    assert.equal(body.name, 'sevalla')
    assert.ok(Array.isArray(body.subcommands), 'expected subcommands to be an array')
    assert.ok(body.subcommands.length > 0, 'expected at least one subcommand')
  })

  // ---------------------------------------------------------------------------
  // Schema – specific command via dot notation
  // ---------------------------------------------------------------------------
  it('sevalla schema apps.create should return the create command schema', async () => {
    const res = await sevalla(['schema', 'apps.create'])
    assert.equal(res.exitCode, 0)
    const body = res.json<{ name: string; options: unknown[] }>()
    assert.equal(body.name, 'create')
    assert.ok(Array.isArray(body.options), 'expected options to be an array')
    assert.ok(body.options.length > 0, 'expected at least one option')
  })

  it('sevalla schema marks mandatory options separately from options that take a value', async () => {
    const res = await sevalla(['schema', 'databases.create'])
    assert.equal(res.exitCode, 0)
    const options = res.json<{ options: Array<Record<string, unknown>> }>().options
    const name = options.find((o) => o.long === '--name')
    const project = options.find((o) => o.long === '--project')
    const json = options.find((o) => o.long === '--json')
    assert.deepEqual([name?.mandatory, name?.takesValue], [true, true])
    assert.deepEqual([project?.mandatory, project?.takesValue], [false, true])
    assert.deepEqual([json?.mandatory, json?.takesValue], [false, false])
    assert.ok(!('required' in (name ?? {})), 'the misleading `required` field is gone')
  })

  it('auth status should report a rejected token as not logged in', async () => {
    const res = await sevalla(['auth', 'status'], { env: { SEVALLA_API_TOKEN: 'revoked-e2e-token' } })
    assert.equal(res.exitCode, 0, `auth status failed: ${res.stderr}`)
    assert.deepEqual(res.json(), { logged_in: false, source: 'environment', token_rejected: true })
  })

  it('--data cannot be combined with body flags', async () => {
    const res = await sevalla(['apps', 'create', '--data', '{}', '--name', 'x'])
    assert.equal(res.exitCode, 1)
    assert.match(res.stderr, /cannot be used with option '--name <name>'/)
  })

  it('--data works without the flags it replaces', async () => {
    const res = await sevalla(['apps', 'create', '--data', '{"display_name":"x","db_password":"p"}', '--dry-run'])
    assert.equal(res.exitCode, 0, `apps create --data --dry-run failed: ${res.stderr}`)
    assert.deepEqual(res.json<{ body: unknown }>().body, { display_name: 'x', db_password: '********' })
  })

  it('databases create --dry-run masks the password', async () => {
    const res = await sevalla([
      'databases', 'create', '--name', 'x', '--type', 'postgresql', '--db-version', '16',
      '--cluster', 'c', '--resource-type', 'r', '--db-name', 'd', '--db-password', 'hunter2-e2e', '--dry-run',
    ])
    assert.equal(res.exitCode, 0, `databases create --dry-run failed: ${res.stderr}`)
    assert.ok(!res.stdout.includes('hunter2-e2e'), 'password must not be echoed')
    assert.equal(res.json<{ options: { dbPassword: string } }>().options.dbPassword, '********')
  })

  // ---------------------------------------------------------------------------
  // Schema – non-existent command should fail
  // ---------------------------------------------------------------------------
  it('sevalla schema nonexistent.command should exit with code 1', async () => {
    const res = await sevallaRaw(['schema', 'nonexistent.command'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Dry run – create commands should support --dry-run
  // ---------------------------------------------------------------------------
  it('sevalla apps create --dry-run should return dry_run payload', async () => {
    const res = await sevalla([
      'apps',
      'create',
      '--name',
      'test',
      '--cluster',
      'c1',
      '--source',
      'publicGit',
      '--dry-run',
    ])
    assert.equal(res.exitCode, 0)
    const body = res.json<{ dry_run: boolean; command: string }>()
    assert.equal(body.dry_run, true)
    assert.equal(body.command, 'create')
  })

  // ---------------------------------------------------------------------------
  // Version flag
  // ---------------------------------------------------------------------------
  it('sevalla --version should print the package version', async () => {
    const { version } = JSON.parse(readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')) as { version: string }
    const res = await sevallaRaw(['--version'])
    assert.equal(res.exitCode, 0)
    assert.equal(res.stdout.trim(), version)
  })

  // ---------------------------------------------------------------------------
  // --json must win over terminal detection
  // ---------------------------------------------------------------------------
  it('sevalla apps list --json should print JSON when stdout is a terminal', async () => {
    const res = await sevallaRaw(['apps', 'list', '--json'], { tty: true })
    assert.equal(res.exitCode, 0, res.stderr)
    assert.ok(Array.isArray(res.json()), 'expected a JSON array, got a table')
  })

  // ---------------------------------------------------------------------------
  // --api-url must override SEVALLA_API_URL, before or after the subcommand
  // ---------------------------------------------------------------------------
  it('--api-url should route requests to the given URL', async () => {
    const paths: string[] = []
    const server = createServer((req, res) => {
      paths.push(req.url ?? '')
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ data: [], total: 0 }))
    })
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v3`
    try {
      const env = { SEVALLA_API_URL: 'http://127.0.0.1:9/v3' }
      const after = await sevalla(['apps', 'list', '--api-url', url], { env })
      assert.equal(after.exitCode, 0, after.stderr)
      const before = await sevalla(['--api-url', url, 'apps', 'list'], { env })
      assert.equal(before.exitCode, 0, before.stderr)
      assert.equal(paths.length, 2)
      assert.ok(paths.every((p) => p.startsWith('/v3/applications')), paths.join(', '))
    } finally {
      server.close()
    }
  })
})
