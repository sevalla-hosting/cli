import { Command } from 'commander';
import { createClient } from '../../../client/api-client.ts';
import { handleError } from '../../../errors/handler.ts';
import {
  jsonOption,
  confirmOption,
  resolveJsonMode,
  dryRunOption,
} from '../../../helpers/flags.ts';
import { printJson, printSuccess } from '../../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../../output/spinner.ts';
import { validateId } from '../../../helpers/validate.ts';

export const servicesRemoveCommand = new Command('remove')
  .description('Remove a service from a project')
  .argument('<project-id>', 'Project ID')
  .argument('<service-id>', 'Service ID')
  .option('--service-type <type>', 'Service type (e.g. app, database, static-site)', 'app')
  .addOption(jsonOption())
  .addOption(confirmOption())
  .addOption(dryRunOption())
  .action(async (projectId: string, serviceId: string, opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      validateId(projectId, 'project-id');
      validateId(serviceId, 'service-id');

      if (opts['dryRun']) {
        printJson({
          dry_run: true,
          command: 'remove',
          action: 'delete',
          'project-id': projectId,
          'service-id': serviceId,
        });
        return;
      }

      if (!opts['confirm']) {
        console.error('Use --confirm to confirm deletion.');
        process.exit(1);
      }
      if (!json) startSpinner('Removing service...');
      const serviceType = (opts['serviceType'] as string) || 'app';
      await client.delete(
        `/projects/${projectId}/services/${serviceId}?service_type=${serviceType}`,
      );
      stopSpinner();
      if (json) {
        printJson({ deleted: true, 'project-id': projectId, 'service-id': serviceId });
      } else {
        printSuccess('Service removed from project.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });
