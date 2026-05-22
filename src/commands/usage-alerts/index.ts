import { Command } from 'commander';
import { usageAlertsListCommand } from './list.ts';
import { usageAlertsGetCommand } from './get.ts';
import { usageAlertsCreateCommand } from './create.ts';
import { usageAlertsUpdateCommand } from './update.ts';
import { usageAlertsDeleteCommand } from './delete.ts';

export function makeUsageAlertsCommand(): Command {
  const cmd = new Command('usage-alerts').description('Manage spending usage alert configs');
  cmd.addCommand(usageAlertsListCommand);
  cmd.addCommand(usageAlertsGetCommand);
  cmd.addCommand(usageAlertsCreateCommand);
  cmd.addCommand(usageAlertsUpdateCommand);
  cmd.addCommand(usageAlertsDeleteCommand);
  return cmd;
}
