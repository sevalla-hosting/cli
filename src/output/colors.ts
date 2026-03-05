import chalk from 'chalk';

export const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  dim: chalk.dim,
  bold: chalk.bold,
  label: chalk.cyan,
  value: chalk.white,
  id: chalk.dim,
  status: {
    active: chalk.green,
    suspended: chalk.yellow,
    pending: chalk.blue,
    error: chalk.red,
    default: chalk.white,
  },
} as const;

export function formatStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'running' || s === 'approved' || s === 'enabled') {
    return colors.status.active(status);
  }
  if (s === 'suspended' || s === 'paused' || s === 'pending' || s === 'building') {
    return colors.status.pending(status);
  }
  if (s === 'error' || s === 'failed' || s === 'denied' || s === 'expired') {
    return colors.status.error(status);
  }
  return colors.status.default(status);
}
