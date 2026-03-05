import { Command } from 'commander';
import { tcpProxiesListCommand } from './list.ts';
import { tcpProxiesCreateCommand } from './create.ts';
import { tcpProxiesDeleteCommand } from './delete.ts';

export function makeTcpProxiesCommands(): Command {
  const cmd = new Command('tcp-proxies').description('Manage TCP proxies');
  cmd.addCommand(tcpProxiesListCommand);
  cmd.addCommand(tcpProxiesCreateCommand);
  cmd.addCommand(tcpProxiesDeleteCommand);
  return cmd;
}
