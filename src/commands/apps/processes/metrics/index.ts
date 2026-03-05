import { Command } from 'commander';
import { cpuUsageCommand } from './cpu-usage.ts';
import { cpuLimitCommand } from './cpu-limit.ts';
import { memoryUsageCommand } from './memory-usage.ts';
import { memoryLimitCommand } from './memory-limit.ts';
import { instanceCountCommand } from './instance-count.ts';

export function makeProcessMetricsCommands(): Command {
  const cmd = new Command('metrics').description('Process metrics');
  cmd.addCommand(cpuUsageCommand);
  cmd.addCommand(cpuLimitCommand);
  cmd.addCommand(memoryUsageCommand);
  cmd.addCommand(memoryLimitCommand);
  cmd.addCommand(instanceCountCommand);
  return cmd;
}
