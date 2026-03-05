import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
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
  it('sevalla --version should print a version string', async () => {
    const res = await sevallaRaw(['--version'])
    assert.equal(res.exitCode, 0)
    // The version output should be a non-empty string (e.g. "0.0.0-development" or semver)
    assert.ok(res.stdout.trim().length > 0, 'expected version output to be non-empty')
    // Should look like a version (contains digits and dots, or "dev")
    assert.match(res.stdout.trim(), /\d/, 'expected version to contain at least one digit')
  })
})
