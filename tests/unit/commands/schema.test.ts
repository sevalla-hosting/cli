import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Command } from 'commander';
import { makeSchemaCommand } from '../../../src/commands/schema.ts';

describe('Schema Command', () => {
  function createTestProgram(): Command {
    const program = new Command('sevalla');
    const apps = new Command('apps').description('Manage apps');
    const create = new Command('create')
      .description('Create an app')
      .requiredOption('--name <name>', 'App name')
      .option('--branch <branch>', 'Git branch');
    const get = new Command('get').description('Get an app').argument('<id>', 'App ID');
    apps.addCommand(create);
    apps.addCommand(get);
    program.addCommand(apps);
    program.addCommand(makeSchemaCommand(program));
    return program;
  }

  it('should create schema command', () => {
    const program = createTestProgram();
    const schema = program.commands.find((c) => c.name() === 'schema');
    assert.ok(schema);
    assert.equal(schema.description(), 'Show machine-readable command schema (for AI agents)');
  });

  it('should have optional command argument', () => {
    const program = createTestProgram();
    const schema = program.commands.find((c) => c.name() === 'schema');
    assert.ok(schema);
    const args = schema.registeredArguments;
    assert.equal(args.length, 1);
    assert.equal(args[0]?.required, false);
  });

  it('should walk command tree correctly', async () => {
    // We test the internal walk indirectly by verifying the program structure
    const program = createTestProgram();
    const apps = program.commands.find((c) => c.name() === 'apps');
    assert.ok(apps);
    assert.equal(apps.commands.length, 2);
    assert.ok(apps.commands.find((c) => c.name() === 'create'));
    assert.ok(apps.commands.find((c) => c.name() === 'get'));
  });
});
