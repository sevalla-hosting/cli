import { Command } from 'commander';
import { usersListCommand } from './list.ts';

export function makeUsersCommand(): Command {
  const cmd = new Command('users').description('Manage users');
  cmd.addCommand(usersListCommand);
  return cmd;
}
