import { Command, Option } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import { jsonOption, resolveJsonMode } from '../../../helpers/flags.ts';
import { validateId } from '../../../helpers/validate.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';

export const maintenanceModeUpdateCommand = new Command('update')
  .description(
    'Turn maintenance mode on or off. While on, every domain of the application answers with the maintenance page and status 503',
  )
  .argument('<app-id>', 'Application ID')
  .addOption(
    new Option('--enabled <bool>', 'Turn maintenance mode on or off')
      .choices(['true', 'false'])
      .makeOptionMandatory(),
  )
  .option('--page-url <url>', 'HTTPS URL of a custom maintenance page ("" for the default page)')
  .addOption(jsonOption())
  .action(async (appId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(appId, 'app-id');
      const body: Record<string, unknown> = { is_enabled: opts['enabled'] === 'true' };
      if (opts['pageUrl'] !== undefined) body['page_url'] = opts['pageUrl'] || null;
      if (!json) startSpinner('Updating...');
      const result = await client.put(`/applications/${appId}/maintenance-mode`, body);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess(`Maintenance mode ${body['is_enabled'] ? 'on' : 'off'}.`);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
