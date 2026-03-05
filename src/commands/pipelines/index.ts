import { Command } from 'commander';
import { pipelinesListCommand } from './list.ts';
import { pipelinesGetCommand } from './get.ts';
import { pipelinesCreateCommand } from './create.ts';
import { pipelinesUpdateCommand } from './update.ts';
import { pipelinesDeleteCommand } from './delete.ts';
import { pipelinesPromoteCommand } from './promote.ts';
import { makeStagesCommands } from './stages/index.ts';
import { makePreviewCommands } from './preview/index.ts';

export function makePipelinesCommand(): Command {
  const cmd = new Command('pipelines').description('Manage pipelines');
  cmd.addCommand(pipelinesListCommand);
  cmd.addCommand(pipelinesGetCommand);
  cmd.addCommand(pipelinesCreateCommand);
  cmd.addCommand(pipelinesUpdateCommand);
  cmd.addCommand(pipelinesDeleteCommand);
  cmd.addCommand(pipelinesPromoteCommand);
  cmd.addCommand(makeStagesCommands());
  cmd.addCommand(makePreviewCommands());
  return cmd;
}
