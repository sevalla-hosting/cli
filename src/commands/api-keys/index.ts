import { Command } from 'commander';
import { apiKeysListCommand } from './list.ts';
import { apiKeysGetCommand } from './get.ts';
import { apiKeysCreateCommand } from './create.ts';
import { apiKeysUpdateCommand } from './update.ts';
import { apiKeysDeleteCommand } from './delete.ts';
import { apiKeysToggleCommand } from './toggle.ts';
import { apiKeysRotateCommand } from './rotate.ts';
import { apiKeysValidateCommand } from './validate.ts';

export function makeApiKeysCommand(): Command {
  const cmd = new Command('api-keys').description('Manage API keys');
  cmd.addCommand(apiKeysListCommand);
  cmd.addCommand(apiKeysGetCommand);
  cmd.addCommand(apiKeysCreateCommand);
  cmd.addCommand(apiKeysUpdateCommand);
  cmd.addCommand(apiKeysDeleteCommand);
  cmd.addCommand(apiKeysToggleCommand);
  cmd.addCommand(apiKeysRotateCommand);
  cmd.addCommand(apiKeysValidateCommand);
  return cmd;
}
