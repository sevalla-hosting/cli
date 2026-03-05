import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderTable, renderKeyValue } from '../../../src/output/table.ts';

describe('Table', () => {
  it('should render a table with columns', () => {
    const items = [
      { id: '1', name: 'App 1', status: 'active' },
      { id: '2', name: 'App 2', status: 'suspended' },
    ];

    const result = renderTable(items, [
      { header: 'ID', key: 'id' },
      { header: 'Name', key: 'name' },
      { header: 'Status', key: 'status' },
    ]);

    assert.ok(result.includes('App 1'));
    assert.ok(result.includes('App 2'));
    assert.ok(result.includes('active'));
    assert.ok(result.includes('suspended'));
  });

  it('should render table with custom getter', () => {
    const items = [{ id: '1', name: 'Test' }];

    const result = renderTable(items, [
      {
        header: 'Display',
        get: (item: { id: string; name: string }) => `${item.name} (${item.id})`,
      },
    ]);

    assert.ok(result.includes('Test (1)'));
  });

  it('should handle null values', () => {
    const items = [{ id: '1', name: null }];

    const result = renderTable(items, [{ header: 'Name', key: 'name' as keyof (typeof items)[0] }]);

    assert.ok(typeof result === 'string');
  });

  it('should render key-value pairs', () => {
    const result = renderKeyValue({
      ID: '123',
      Name: 'Test App',
      Status: 'active',
    });

    assert.ok(result.includes('123'));
    assert.ok(result.includes('Test App'));
    assert.ok(result.includes('active'));
  });
});
