import { Command } from 'commander';
import { dockerRegistriesListCommand } from './list.ts';
import { dockerRegistriesGetCommand } from './get.ts';
import { dockerRegistriesCreateCommand } from './create.ts';
import { dockerRegistriesUpdateCommand } from './update.ts';
import { dockerRegistriesDeleteCommand } from './delete.ts';

export function makeDockerRegistriesCommand(): Command {
  const cmd = new Command('docker-registries').description('Manage Docker registries');
  cmd.addCommand(dockerRegistriesListCommand);
  cmd.addCommand(dockerRegistriesGetCommand);
  cmd.addCommand(dockerRegistriesCreateCommand);
  cmd.addCommand(dockerRegistriesUpdateCommand);
  cmd.addCommand(dockerRegistriesDeleteCommand);
  return cmd;
}
