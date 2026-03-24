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
    printTable({ data: [], total: 0, offset: 0, limit: 25 }, [
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

  it('should show pagination info with limit/offset response', async () => {
    captureLog();
    const { printTable } = await import('../../../src/output/formatter.ts');
    printTable(
      {
        data: [{ id: '1' }, { id: '2' }],
        total: 50,
        offset: 0,
        limit: 25,
      },
      [{ header: 'ID', key: 'id' }],
    );

    assert.ok(logOutput.some((line) => line.includes('Showing 1-25 of 50')));
  });

  it('should show correct range for second page', async () => {
    captureLog();
    const { printTable } = await import('../../../src/output/formatter.ts');
    printTable(
      {
        data: [{ id: '26' }],
        total: 30,
        offset: 25,
        limit: 25,
      },
      [{ header: 'ID', key: 'id' }],
    );

    assert.ok(logOutput.some((line) => line.includes('Showing 26-30 of 30')));
  });

  it('should print warning message', async () => {
    captureLog();
    const { printWarning } = await import('../../../src/output/formatter.ts');
    printWarning('Be careful');

    assert.ok(logOutput.some((line) => line.includes('Be careful')));
  });
});
