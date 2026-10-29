import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { backupTargetBody } from '../../../src/commands/databases/backup-targets/options.ts';

describe('Backup target body', () => {
  it('should map flags to spec fields', () => {
    assert.deepEqual(
      backupTargetBody({
        name: 'nightly',
        schedule: '15 3 * * *',
        enabled: 'false',
        retentionDays: '10',
        manualRetentionDays: '0',
        bucket: 'dumps',
        accessKey: 'AK',
        secretKey: 'SK',
      }),
      {
        display_name: 'nightly',
        schedule: '15 3 * * *',
        is_enabled: false,
        retention_days: 10,
        manual_retention_days: 0,
        bucket_name: 'dumps',
        access_key: 'AK',
        secret_key: 'SK',
      },
    );
  });

  it('should send null for an empty --schedule or --prefix to restore the defaults', () => {
    assert.deepEqual(backupTargetBody({ schedule: '', prefix: '' }), {
      schedule: null,
      prefix: null,
    });
  });

  it('should reject --enabled values that are not true or false', () => {
    assert.throws(() => backupTargetBody({ enabled: 'yes' }), /--enabled must be true or false/);
  });
});
