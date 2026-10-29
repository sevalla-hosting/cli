import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { validateId } from '../../../helpers/validate.ts';
import { printJson, printResource } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const dockerfilesGetCommand = new Command('get')
  .description('Get a Dockerfile version with its content and .dockerignore')
  .requiredOption('--app-id <id>', 'Application ID')
  .argument('<dockerfile-id>', 'Dockerfile ID (the dockerfile_id of a deployment)')
  .addOption(jsonOption())
  .action(async (dockerfileId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(opts['appId'] as string, 'app-id');
      validateId(dockerfileId, 'dockerfile-id');
      if (!json) startSpinner('Fetching...');
      const result = await client.get<Record<string, unknown>>(
        `/applications/${opts['appId']}/dockerfiles/${dockerfileId}`,
      );
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource({
          ID: result['id'],
          Version: result['version'],
          Source: result['source'],
          Language: result['language'],
          'Ingot Version': result['ingot_version'],
          'Created At': result['created_at'],
        });
        console.log(`\n${String(result['dockerfile'])}`);
        if (result['dockerignore'])
          console.log(`\n.dockerignore:\n${String(result['dockerignore'])}`);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
