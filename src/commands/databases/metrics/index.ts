import { Command } from 'commander';
import { cpuUsageCommand } from './cpu-usage.ts';
import { cpuLimitCommand } from './cpu-limit.ts';
import { memoryUsageCommand } from './memory-usage.ts';
import { memoryLimitCommand } from './memory-limit.ts';
import { storageUsageCommand } from './storage-usage.ts';
import { storageLimitCommand } from './storage-limit.ts';
import { allStorageCommand } from './all-storage.ts';
import { usedStorageCommand } from './used-storage.ts';

export function makeDatabaseMetricsCommands(): Command {
  const cmd = new Command('metrics').description('Database metrics');
  cmd.addCommand(cpuUsageCommand);
  cmd.addCommand(cpuLimitCommand);
  cmd.addCommand(memoryUsageCommand);
  cmd.addCommand(memoryLimitCommand);
  cmd.addCommand(storageUsageCommand);
  cmd.addCommand(storageLimitCommand);
  cmd.addCommand(allStorageCommand);
  cmd.addCommand(usedStorageCommand);
  return cmd;
}
