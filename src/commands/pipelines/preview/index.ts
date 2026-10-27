import { Command } from 'commander';
import { previewEnableCommand } from './enable.ts';
import { previewDisableCommand } from './disable.ts';
import { previewUpdateCommand } from './update.ts';
import { previewCreateAppCommand } from './create-app.ts';

export function makePreviewCommands(): Command {
  const cmd = new Command('preview').description('Manage pipeline preview');
  cmd.addCommand(previewEnableCommand);
  cmd.addCommand(previewDisableCommand);
  cmd.addCommand(previewUpdateCommand);
  cmd.addCommand(previewCreateAppCommand);
  return cmd;
}
