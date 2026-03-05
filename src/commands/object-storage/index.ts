import { Command } from 'commander';
import { objectStorageListCommand } from './list.ts';
import { objectStorageGetCommand } from './get.ts';
import { objectStorageCreateCommand } from './create.ts';
import { objectStorageUpdateCommand } from './update.ts';
import { objectStorageDeleteCommand } from './delete.ts';
import { makeCdnDomainCommands } from './cdn-domain/index.ts';
import { makeCorsPoliciesCommands } from './cors-policies/index.ts';
import { makeObjectsCommands } from './objects/index.ts';

export function makeObjectStorageCommand(): Command {
  const cmd = new Command('object-storage').description('Manage object storage');
  cmd.addCommand(objectStorageListCommand);
  cmd.addCommand(objectStorageGetCommand);
  cmd.addCommand(objectStorageCreateCommand);
  cmd.addCommand(objectStorageUpdateCommand);
  cmd.addCommand(objectStorageDeleteCommand);
  cmd.addCommand(makeCdnDomainCommands());
  cmd.addCommand(makeCorsPoliciesCommands());
  cmd.addCommand(makeObjectsCommands());
  return cmd;
}
