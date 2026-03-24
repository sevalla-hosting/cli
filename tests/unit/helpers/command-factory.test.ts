import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeListCommand,
  makeGetCommand,
  makeCreateCommand,
  makeUpdateCommand,
  makeDeleteCommand,
  makeActionCommand,
  makeSubResourceDeleteCommand,
  makeSubResourceActionCommand,
} from '../../../src/helpers/command-factory.ts';

describe('Command Factory', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  it('should create a list command with correct name', () => {
    const cmd = makeListCommand({
      name: 'list',
      description: 'List items',
      columns: [{ header: 'ID', key: 'id' }],
      apiCall: async () => ({
        data: [],
        total: 0,
        offset: 0,
        limit: 25,
      }),
    });

    assert.equal(cmd.name(), 'list');
    assert.equal(cmd.description(), 'List items');
  });

  it('should create a get command with id argument', () => {
    const cmd = makeGetCommand({
      name: 'get',
      description: 'Get item',
      displayFields: (item: Record<string, unknown>) => ({ ID: item['id'] }),
      apiCall: async () => ({ id: '123' }),
    });

    assert.equal(cmd.name(), 'get');
  });

  it('should create a delete command with --confirm and --dry-run options', () => {
    const cmd = makeDeleteCommand({
      name: 'delete',
      description: 'Delete item',
      apiCall: async () => {},
    });

    assert.equal(cmd.name(), 'delete');
    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--confirm'));
    assert.ok(opts.includes('--json'));
    assert.ok(opts.includes('--dry-run'));
  });

  it('should create an action command with --dry-run', () => {
    const cmd = makeActionCommand({
      name: 'activate',
      description: 'Activate item',
      apiCall: async () => {},
      successMessage: 'Activated!',
    });

    assert.equal(cmd.name(), 'activate');
    assert.equal(cmd.description(), 'Activate item');
    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--dry-run'));
  });

  it('should add parent id flag to list command', () => {
    const cmd = makeListCommand({
      name: 'list',
      description: 'List sub-items',
      columns: [{ header: 'ID', key: 'id' }],
      apiCall: async () => ({ data: [] }),
      parentIdFlag: { name: 'parent-id', description: 'Parent ID' },
    });

    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--parent-id'));
  });

  it('should add --dry-run to create command', () => {
    const cmd = makeCreateCommand({
      name: 'create',
      description: 'Create item',
      options: [{ flags: '--name <name>', description: 'Name', required: true }],
      apiCall: async () => ({ id: '1' }),
    });

    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--dry-run'));
  });

  it('should add --data to create command when apiPath is set', () => {
    const cmd = makeCreateCommand({
      name: 'create',
      description: 'Create item',
      options: [{ flags: '--name <name>', description: 'Name', required: true }],
      apiCall: async () => ({ id: '1' }),
      apiPath: '/items',
    });

    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--data'));
  });

  it('should not add --data to create command without apiPath', () => {
    const cmd = makeCreateCommand({
      name: 'create',
      description: 'Create item',
      options: [{ flags: '--name <name>', description: 'Name', required: true }],
      apiCall: async () => ({ id: '1' }),
    });

    const opts = cmd.options.map((o) => o.long);
    assert.ok(!opts.includes('--data'));
  });

  it('should add --dry-run to update command', () => {
    const cmd = makeUpdateCommand({
      name: 'update',
      description: 'Update item',
      options: [{ flags: '--name <name>', description: 'Name' }],
      apiCall: async () => ({ id: '1' }),
    });

    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--dry-run'));
  });

  it('should add --dry-run to sub-resource delete command', () => {
    const cmd = makeSubResourceDeleteCommand({
      name: 'delete',
      description: 'Delete sub-resource',
      parentIdName: 'app-id',
      childIdName: 'domain-id',
      apiCall: async () => {},
    });

    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--dry-run'));
    assert.ok(opts.includes('--confirm'));
  });

  it('should add --dry-run to sub-resource action command', () => {
    const cmd = makeSubResourceActionCommand({
      name: 'verify',
      description: 'Verify sub-resource',
      parentIdName: 'app-id',
      childIdName: 'domain-id',
      apiCall: async () => {},
    });

    const opts = cmd.options.map((o) => o.long);
    assert.ok(opts.includes('--dry-run'));
  });

  it('should convert page/perPage to limit/offset and inject into GET requests', async () => {
    const originalFetch = globalThis.fetch;
    let capturedUrl = '';

    globalThis.fetch = (async (url: string) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ data: [], total: 0, offset: 0, limit: 10 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    try {
      const cmd = makeListCommand({
        name: 'list',
        description: 'List items',
        columns: [{ header: 'ID', key: 'id' }],
        apiCall: (client) => client.get('/items'),
      });

      // Prevent commander from calling process.exit
      cmd.exitOverride();
      cmd.configureOutput({ writeErr: () => {}, writeOut: () => {} });

      await cmd.parseAsync(['--page', '3', '--per-page', '10', '--json'], { from: 'user' });

      const url = new URL(capturedUrl);
      assert.equal(url.searchParams.get('limit'), '10');
      assert.equal(url.searchParams.get('offset'), '20');
      // Should NOT send the old page/per_page params
      assert.equal(url.searchParams.has('page'), false);
      assert.equal(url.searchParams.has('per_page'), false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should use default pagination (page 1, 25 per page) when no flags given', async () => {
    const originalFetch = globalThis.fetch;
    let capturedUrl = '';

    globalThis.fetch = (async (url: string) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ data: [], total: 0, offset: 0, limit: 25 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    try {
      const cmd = makeListCommand({
        name: 'list',
        description: 'List items',
        columns: [{ header: 'ID', key: 'id' }],
        apiCall: (client) => client.get('/items'),
      });

      cmd.exitOverride();
      cmd.configureOutput({ writeErr: () => {}, writeOut: () => {} });

      await cmd.parseAsync(['--json'], { from: 'user' });

      const url = new URL(capturedUrl);
      assert.equal(url.searchParams.get('limit'), '25');
      assert.equal(url.searchParams.get('offset'), '0');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should preserve extra query params alongside pagination', async () => {
    const originalFetch = globalThis.fetch;
    let capturedUrl = '';

    globalThis.fetch = (async (url: string) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ data: [], total: 0, offset: 0, limit: 25 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    try {
      const cmd = makeListCommand({
        name: 'list',
        description: 'List items',
        columns: [{ header: 'ID', key: 'id' }],
        apiCall: (client) => client.get('/items', { status: 'active' }),
      });

      cmd.exitOverride();
      cmd.configureOutput({ writeErr: () => {}, writeOut: () => {} });

      await cmd.parseAsync(['--page', '2', '--json'], { from: 'user' });

      const url = new URL(capturedUrl);
      assert.equal(url.searchParams.get('limit'), '25');
      assert.equal(url.searchParams.get('offset'), '25');
      assert.equal(url.searchParams.get('status'), 'active');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
