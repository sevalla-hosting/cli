import { Command, Option } from 'commander';
import type { ApiClient } from '../client/api-client.ts';
import { createClient } from '../client/api-client.ts';
import { handleError } from '../errors/handler.ts';
import { printJson, printResource, printTable } from '../output/formatter.ts';
import { startSpinner, stopSpinner } from '../output/spinner.ts';
import { jsonOption, resolveJsonMode } from './flags.ts';
import { validateId } from './validate.ts';

type Item = Record<string, unknown>;

function repositoryCommand(
  name: string,
  description: string,
  idArg: { name: string; description: string },
  options: Option[],
  fetch: (client: ApiClient, id: string, opts: Record<string, unknown>) => Promise<Item>,
  print: (result: Item) => void,
): Command {
  const cmd = new Command(name)
    .description(description)
    .argument(`<${idArg.name}>`, idArg.description);
  cmd.addOption(jsonOption());
  for (const opt of options) cmd.addOption(opt);
  return cmd.action(async (id: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(id, idArg.name);
      if (!json) startSpinner('Fetching...');
      const result = await fetch(client, id, opts);
      stopSpinner();
      if (json) printJson(result);
      else print(result);
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
}

const refOption = (): Option =>
  new Option('--ref <ref>', 'Branch, tag or commit SHA (default: the deployed commit)');

// Applications and static sites expose the same repository endpoints
export function makeRepositoryCommands(
  base: string,
  idArg: { name: string; description: string },
): Command {
  const cmd = new Command('repository').description('Browse the connected Git repository');

  cmd.addCommand(
    repositoryCommand(
      'get',
      'Get the repository and the commit currently deployed',
      idArg,
      [],
      (client, id) => client.get(`${base}/${id}/repository`),
      (r) => {
        const commit = r['deployed_commit'] as Item | null;
        printResource({
          Source: r['source'],
          Provider: r['git_type'],
          Repository: r['repo_url'],
          'Default Branch': r['default_branch'],
          'Deployed Commit': commit?.['sha'],
          'Commit Message': commit?.['message'],
        });
      },
    ),
  );

  cmd.addCommand(
    repositoryCommand(
      'tree',
      'List the files and directories at a path',
      idArg,
      [
        refOption(),
        new Option('--path <path>', 'Directory relative to the repository root (default: root)'),
        new Option('--recursive', 'List everything under the path, not only its children'),
      ],
      (client, id, opts) =>
        client.get(`${base}/${id}/repository/tree`, {
          ref: opts['ref'] as string | undefined,
          path: opts['path'] as string | undefined,
          recursive: opts['recursive'] ? 'true' : undefined,
        }),
      (r) =>
        printTable(r['entries'] as Item[], [
          { header: 'Path', key: 'path' },
          { header: 'Type', key: 'type' },
          { header: 'Size', key: 'size' },
        ]),
    ),
  );

  cmd.addCommand(
    repositoryCommand(
      'contents',
      'Print a file from the repository',
      idArg,
      [
        new Option(
          '--path <path>',
          'File path relative to the repository root',
        ).makeOptionMandatory(),
        refOption(),
      ],
      (client, id, opts) =>
        client.get(`${base}/${id}/repository/contents`, {
          path: opts['path'] as string,
          ref: opts['ref'] as string | undefined,
        }),
      (r) => {
        if (r['content'] === null) {
          console.error(
            r['is_binary'] ? 'Binary file, no content.' : 'File over 1 MB, no content.',
          );
        } else {
          process.stdout.write(String(r['content']));
        }
      },
    ),
  );

  cmd.addCommand(
    repositoryCommand(
      'search',
      'Search the code on the default branch',
      idArg,
      [new Option('--query <text>', 'Text to search for').makeOptionMandatory()],
      (client, id, opts) =>
        client.get(`${base}/${id}/repository/search`, { query: opts['query'] as string }),
      (r) =>
        printTable(r['matches'] as Item[], [
          { header: 'Path', key: 'path' },
          { header: 'Line', key: 'line' },
          { header: 'Preview', key: 'preview' },
        ]),
    ),
  );

  return cmd;
}
