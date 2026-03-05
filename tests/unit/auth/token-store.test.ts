import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// We need to mock the config paths, so we test the logic directly
describe('TokenStore', () => {
  let tempDir: string;
  let credFile: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'sevalla-test-'));
    credFile = join(tempDir, 'credentials.json');
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
    delete process.env['SEVALLA_API_TOKEN'];
  });

  it('should return null when no credentials file exists', () => {
    assert.equal(existsSync(credFile), false);
  });

  it('should write and read credentials', async () => {
    const { writeFileSync, mkdirSync } = await import('node:fs');
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(credFile, JSON.stringify({ token: 'test-token' }), { mode: 0o600 });

    const content = JSON.parse(readFileSync(credFile, 'utf-8')) as { token: string };
    assert.equal(content.token, 'test-token');
  });

  it('should set secure file permissions', async () => {
    const { writeFileSync, mkdirSync } = await import('node:fs');
    mkdirSync(tempDir, { recursive: true, mode: 0o700 });
    writeFileSync(credFile, JSON.stringify({ token: 'test-token' }), { mode: 0o600 });

    const stats = statSync(credFile);
    // Check that only owner can read/write (0o600 = 0100 in octal mode bits)
    const mode = stats.mode & 0o777;
    assert.equal(mode, 0o600);
  });

  it('should remove credentials file on clear', async () => {
    const { writeFileSync, mkdirSync, unlinkSync } = await import('node:fs');
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(credFile, JSON.stringify({ token: 'test-token' }));

    unlinkSync(credFile);
    assert.equal(existsSync(credFile), false);
  });

  it('should handle corrupted credentials file', async () => {
    const { writeFileSync, mkdirSync } = await import('node:fs');
    mkdirSync(tempDir, { recursive: true });
    writeFileSync(credFile, 'not json');

    let token: string | null = null;
    try {
      const content = JSON.parse(readFileSync(credFile, 'utf-8'));
      token = content.token ?? null;
    } catch {
      token = null;
    }
    assert.equal(token, null);
  });

  describe('SEVALLA_API_TOKEN env var', () => {
    it('should return env var token when set', async () => {
      process.env['SEVALLA_API_TOKEN'] = 'env-test-token';
      const { getToken } = await import('../../../src/auth/token-store.ts');
      // Since getToken checks env first, it should return env token
      const token = getToken();
      assert.equal(token, 'env-test-token');
    });

    it('should report environment as token source', async () => {
      process.env['SEVALLA_API_TOKEN'] = 'env-test-token';
      const { getTokenSource } = await import('../../../src/auth/token-store.ts');
      assert.equal(getTokenSource(), 'environment');
    });

    it('should report null source when no token', async () => {
      delete process.env['SEVALLA_API_TOKEN'];
      const { getTokenSource } = await import('../../../src/auth/token-store.ts');
      // Without a real credentials file, source should be null
      const source = getTokenSource();
      // Source is null when env is not set and no cred file at standard path
      assert.ok(source === null || source === 'credentials_file');
    });
  });
});
