import { Command } from 'commander';
import { cdnDomainEnableCommand } from './enable.ts';
import { cdnDomainDisableCommand } from './disable.ts';

export function makeCdnDomainCommands(): Command {
  const cmd = new Command('cdn-domain').description('Manage object storage CDN domain');
  cmd.addCommand(cdnDomainEnableCommand);
  cmd.addCommand(cdnDomainDisableCommand);
  return cmd;
}
