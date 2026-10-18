import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { previewBody } from '../../../src/commands/pipelines/preview/update.ts';

describe('Pipeline preview body', () => {
  it('should map flags to spec fields', () => {
    assert.deepEqual(
      previewBody({
        repoUrl: 'https://github.com/a/b',
        autoCreateApp: 'true',
        deleteStaleApps: 'false',
        staleAppDays: '7',
      }),
      {
        repo_url: 'https://github.com/a/b',
        auto_create_app: true,
        delete_stale_apps: false,
        stale_app_days: 7,
      },
    );
  });

  it('should reject boolean flags that are not true or false', () => {
    assert.throws(
      () => previewBody({ autoCreateApp: 'yes' }),
      /--auto-create-app must be true or false/,
    );
  });
});
