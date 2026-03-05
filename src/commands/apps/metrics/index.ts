import { Command } from 'commander';
import { requestsPerMinuteCommand } from './requests-per-minute.ts';
import { responseTimeCommand } from './response-time.ts';
import { responseTimeAvgCommand } from './response-time-avg.ts';
import { statusCodesCommand } from './status-codes.ts';
import { topStatusCodesCommand } from './top-status-codes.ts';
import { topCountriesCommand } from './top-countries.ts';
import { slowestRequestsCommand } from './slowest-requests.ts';
import { topPagesCommand } from './top-pages.ts';

export function makeAppMetricsCommands(): Command {
  const cmd = new Command('metrics').description('Application metrics');
  cmd.addCommand(requestsPerMinuteCommand);
  cmd.addCommand(responseTimeCommand);
  cmd.addCommand(responseTimeAvgCommand);
  cmd.addCommand(statusCodesCommand);
  cmd.addCommand(topStatusCodesCommand);
  cmd.addCommand(topCountriesCommand);
  cmd.addCommand(slowestRequestsCommand);
  cmd.addCommand(topPagesCommand);
  return cmd;
}
