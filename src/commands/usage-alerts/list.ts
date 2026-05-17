import { Command, Option } from 'commander';
import { createClient } from '../../client/api-client.ts';
import { handleError } from '../../errors/handler.ts';
import { printJson, printTable } from '../../output/formatter.ts';
import { startSpinner, stopSpinner } from '../../output/spinner.ts';
import { jsonOption, paginationOptions, resolveJsonMode } from '../../helpers/flags.ts';
import type { PaginatedResponse, QueryParams } from '../../client/types.ts';
import { validateId } from '../../helpers/validate.ts';

interface UsageAlertRow {
  id: string;
  project_id: string | null;
  limit_usd: number;
  emails: string[];
  triggers: Array<{ percentage: number }>;
}

export const usageAlertsListCommand = (() => {
  const cmd = new Command('list').description('List usage alert configs');
  cmd.addOption(jsonOption());
  cmd.addOption(
    new Option('--project-id <id>', 'Filter to a specific project. Omit to list company-wide.'),
  );
  for (const opt of paginationOptions()) {
    cmd.addOption(opt);
  }

  cmd.action(async (opts: Record<string, unknown>) => {
    const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
    const json = resolveJsonMode(opts);
    try {
      if (opts['projectId']) {
        validateId(opts['projectId'] as string, 'project-id');
      }
      if (!json) startSpinner('Fetching...');

      const perPage = opts['perPage'] as number;
      const page = opts['page'] as number;
      const query: QueryParams = {
        limit: perPage,
        offset: (page - 1) * perPage,
      };
      if (opts['projectId']) query['project_id'] = opts['projectId'] as string;

      const result = await client.get<PaginatedResponse<UsageAlertRow>>('/usage-alerts', query);
      stopSpinner();
      if (json) {
        printJson(result.data);
      } else {
        printTable(result, [
          { header: 'ID', key: 'id' },
          { header: 'Project', key: 'project_id' },
          { header: 'Limit (USD)', key: 'limit_usd' },
          { header: 'Emails', get: (item) => item.emails.join(', ') },
          {
            header: 'Triggers',
            get: (item) => item.triggers.map((t) => `${t.percentage}%`).join(', '),
          },
        ]);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
})();
