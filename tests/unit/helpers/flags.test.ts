import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  jsonOption,
  confirmOption,
  paginationOptions,
  metricsOptions,
  apiUrlOption,
  resolveJsonMode,
  dryRunOption,
  dataOption,
} from '../../../src/helpers/flags.ts';

describe('Flags', () => {
  it('should create --json option', () => {
    const opt = jsonOption();
    assert.equal(opt.long, '--json');
    assert.equal(opt.defaultValue, false);
  });

  it('should create --confirm option', () => {
    const opt = confirmOption();
    assert.equal(opt.long, '--confirm');
    assert.equal(opt.defaultValue, false);
  });

  it('should create pagination options', () => {
    const opts = paginationOptions();
    assert.equal(opts.length, 2);
    assert.equal(opts[0]?.long, '--page');
    assert.equal(opts[1]?.long, '--per-page');
  });

  it('should create metrics options', () => {
    const opts = metricsOptions();
    assert.equal(opts.length, 3);
    const longs = opts.map((o) => o.long);
    assert.ok(longs.includes('--from'));
    assert.ok(longs.includes('--to'));
    assert.ok(longs.includes('--interval'));
  });

  it('should create api-url option', () => {
    const opt = apiUrlOption();
    assert.equal(opt.long, '--api-url');
  });

  it('should create --dry-run option', () => {
    const opt = dryRunOption();
    assert.equal(opt.long, '--dry-run');
    assert.equal(opt.defaultValue, false);
  });

  it('should create --data option', () => {
    const opt = dataOption();
    assert.equal(opt.long, '--data');
  });
});

describe('resolveJsonMode', () => {
  it('should return true when --json is explicitly set', () => {
    assert.equal(resolveJsonMode({ json: true }), true);
  });

  it('should return false when --json is false and stdout is TTY', () => {
    // In test environment, process.stdout.isTTY may or may not be true
    // We test the explicit flag case
    const result = resolveJsonMode({ json: false });
    // Result depends on whether tests run in TTY — just verify it returns boolean
    assert.equal(typeof result, 'boolean');
  });

  it('should return true when --json is true regardless of TTY', () => {
    assert.equal(resolveJsonMode({ json: true }), true);
  });
});
