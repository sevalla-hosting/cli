import { Command } from 'commander';
import { webhooksListCommand } from './list.ts';
import { webhooksGetCommand } from './get.ts';
import { webhooksCreateCommand } from './create.ts';
import { webhooksUpdateCommand } from './update.ts';
import { webhooksDeleteCommand } from './delete.ts';
import { webhooksToggleCommand } from './toggle.ts';
import { webhooksRollSecretCommand } from './roll-secret.ts';
import { makeDeliveriesCommands } from './deliveries/index.ts';

export function makeWebhooksCommand(): Command {
  const cmd = new Command('webhooks').description('Manage webhooks');
  cmd.addCommand(webhooksListCommand);
  cmd.addCommand(webhooksGetCommand);
  cmd.addCommand(webhooksCreateCommand);
  cmd.addCommand(webhooksUpdateCommand);
  cmd.addCommand(webhooksDeleteCommand);
  cmd.addCommand(webhooksToggleCommand);
  cmd.addCommand(webhooksRollSecretCommand);
  cmd.addCommand(makeDeliveriesCommands());
  return cmd;
}
