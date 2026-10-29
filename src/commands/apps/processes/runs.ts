import { makeListCommand } from '../../../helpers/command-factory.ts';
import { validateId } from '../../../helpers/validate.ts';

export const processesRunsCommand = makeListCommand({
  name: 'runs',
  description: 'List the runs of a cron process from the last 30 days, newest first',
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
  options: [{ flags: '--process-id <id>', description: 'Cron process ID', required: true }],
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Trigger', key: 'trigger' },
    { header: 'Status', key: 'status' },
    { header: 'Reason', key: 'reason' },
    { header: 'Exit Code', key: 'exit_code' },
    { header: 'Retries', key: 'retries' },
    { header: 'Scheduled At', key: 'scheduled_at' },
    { header: 'Finished At', key: 'finished_at' },
  ],
  apiCall: (client, opts) =>
    client.get(
      `/applications/${opts['appId']}/processes/${validateId(opts['processId'] as string, 'process-id')}/runs`,
    ),
});
