import { parseBool } from '../../../helpers/validate.ts';

// Shared by create and update, which take the same fields
export const backupTargetOptions = [
  {
    flags: '--schedule <cron>',
    description:
      'Cron schedule in UTC, at most every 30 minutes ("" on update: daily at an assigned time)',
  },
  { flags: '--enabled <bool>', description: 'Run scheduled backups (true/false, default: true)' },
  { flags: '--retention-days <days>', description: 'Days scheduled backups are kept (default: 7)' },
  {
    flags: '--manual-retention-days <days>',
    description: 'Days manual backups are kept, 0 for forever (default: 14)',
  },
  {
    flags: '--prefix <prefix>',
    description: 'Key prefix of the dump files ("" on update: the default per-database prefix)',
  },
  {
    flags: '--object-storage <id>',
    description: 'Sevalla object storage bucket to upload to, instead of an external bucket',
  },
  { flags: '--bucket <name>', description: 'External S3-compatible bucket name' },
  { flags: '--endpoint <url>', description: 'External storage endpoint URL' },
  { flags: '--region <region>', description: 'External storage region' },
  { flags: '--access-key <key>', description: 'External storage access key' },
  { flags: '--secret-key <key>', description: 'External storage secret key' },
];

export function backupTargetBody(opts: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (opts['name']) body['display_name'] = opts['name'];
  if (opts['schedule'] !== undefined) body['schedule'] = opts['schedule'] || null;
  if (opts['enabled'] !== undefined) body['is_enabled'] = parseBool(opts['enabled'], '--enabled');
  if (opts['retentionDays'] !== undefined) body['retention_days'] = Number(opts['retentionDays']);
  if (opts['manualRetentionDays'] !== undefined)
    body['manual_retention_days'] = Number(opts['manualRetentionDays']);
  if (opts['prefix'] !== undefined) body['prefix'] = opts['prefix'] || null;
  if (opts['objectStorage']) body['object_storage_id'] = opts['objectStorage'];
  if (opts['bucket']) body['bucket_name'] = opts['bucket'];
  if (opts['endpoint']) body['endpoint'] = opts['endpoint'];
  if (opts['region']) body['region'] = opts['region'];
  if (opts['accessKey']) body['access_key'] = opts['accessKey'];
  if (opts['secretKey']) body['secret_key'] = opts['secretKey'];
  return body;
}
