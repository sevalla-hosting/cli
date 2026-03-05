import { Command } from 'commander';
import { printJson } from '../output/formatter.ts';

interface SchemaOption {
  long: string;
  short?: string;
  required: boolean;
  description: string;
  defaultValue?: unknown;
}

interface SchemaArgument {
  name: string;
  required: boolean;
  description: string;
}

interface SchemaEntry {
  name: string;
  path: string;
  description: string;
  arguments: SchemaArgument[];
  options: SchemaOption[];
  subcommands: SchemaEntry[];
}

function walkCommand(cmd: Command, parentPath: string): SchemaEntry {
  const path = parentPath ? `${parentPath} ${cmd.name()}` : cmd.name();

  const args: SchemaArgument[] = cmd.registeredArguments.map((arg) => ({
    name: arg.name(),
    required: arg.required,
    description: arg.description,
  }));

  const options: SchemaOption[] = cmd.options
    .filter((opt) => opt.long !== '--version')
    .map((opt) => ({
      long: opt.long ?? '',
      short: opt.short,
      required: opt.required ?? false,
      description: opt.description,
      defaultValue: opt.defaultValue,
    }));

  const subcommands: SchemaEntry[] = cmd.commands.map((sub) => walkCommand(sub, path));

  return {
    name: cmd.name(),
    path,
    description: cmd.description(),
    arguments: args,
    options,
    subcommands,
  };
}

function findByDotPath(root: SchemaEntry, dotPath: string): SchemaEntry | null {
  const parts = dotPath.split('.');
  let current = root;
  for (const part of parts) {
    const found = current.subcommands.find((s) => s.name === part);
    if (!found) return null;
    current = found;
  }
  return current;
}

export function makeSchemaCommand(program: Command): Command {
  const cmd = new Command('schema')
    .description('Show machine-readable command schema (for AI agents)')
    .argument('[command]', 'Command path using dot notation (e.g., apps.create)')
    .action((commandPath: string | undefined) => {
      const root = walkCommand(program, '');

      if (commandPath) {
        const entry = findByDotPath(root, commandPath);
        if (!entry) {
          console.error(`Command not found: ${commandPath}`);
          process.exit(1);
        }
        printJson(entry);
      } else {
        printJson(root);
      }
    });

  return cmd;
}
