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
        pagination: { page: 1, per_page: 25, total: 0, total_pages: 0 },
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
});
