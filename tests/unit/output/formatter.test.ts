import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('Formatter', () => {
  let logOutput: string[] = [];
  const originalLog = console.log;

  afterEach(() => {
    console.log = originalLog;
    logOutput = [];
    mock.restoreAll();
  });

  function captureLog() {
    logOutput = [];
    console.log = (...args: unknown[]) => {
      logOutput.push(args.map(String).join(' '));
    };
  }

  it('should output JSON with printJson', async () => {
    captureLog();
    const { printJson } = await import('../../../src/output/formatter.ts');
    printJson({ id: '123', name: 'test' });

    assert.equal(logOutput.length, 1);
    const parsed = JSON.parse(logOutput[0] as string);
    assert.equal(parsed.id, '123');
    assert.equal(parsed.name, 'test');
  });

  it('should display empty message for empty list', async () => {
    captureLog();
    const { printTable } = await import('../../../src/output/formatter.ts');
    printTable({ data: [], pagination: { page: 1, per_page: 25, total: 0, total_pages: 0 } }, [
      { header: 'ID', key: 'id' },
    ]);

    assert.ok(logOutput.some((line) => line.includes('No results found')));
  });

  it('should print success message', async () => {
    captureLog();
    const { printSuccess } = await import('../../../src/output/formatter.ts');
    printSuccess('Operation completed');

    assert.ok(logOutput.some((line) => line.includes('Operation completed')));
  });

  it('should print warning message', async () => {
    captureLog();
    const { printWarning } = await import('../../../src/output/formatter.ts');
    printWarning('Be careful');

    assert.ok(logOutput.some((line) => line.includes('Be careful')));
  });
});
