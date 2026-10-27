import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { previewBody } from '../../../src/commands/pipelines/preview/update.ts';
import { previewAppBody } from '../../../src/commands/pipelines/preview/create-app.ts';

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

  it('should send --preview-app as the parsed preview_app object', () => {
    const previewApp = { cluster_id: 'c1', processes: [{ type: 'web', port: 8080 }] };
    assert.deepEqual(previewBody({ previewApp: JSON.stringify(previewApp) }), {
      preview_app: previewApp,
    });
  });

  it('should reject --preview-app values that are not JSON', () => {
    assert.throws(
      () => previewBody({ previewApp: '{cluster_id' }),
      /--preview-app must be valid JSON/,
    );
  });
});

describe('Preview app body', () => {
  it('should send the branch alone when no pull request is given', () => {
    assert.deepEqual(previewAppBody({ branch: 'feature/checkout' }), {
      branch: 'feature/checkout',
    });
  });

  it('should send the pull request as a number', () => {
    assert.deepEqual(previewAppBody({ branch: 'feature/checkout', pullRequest: '42' }), {
      branch: 'feature/checkout',
      pull_request_number: 42,
    });
  });

  it('should reject a pull request that is not a positive whole number', () => {
    for (const pullRequest of ['PR-42', 'https://github.com/a/b/pull/42', '0', '4.2']) {
      assert.throws(
        () => previewAppBody({ branch: 'main', pullRequest }),
        /--pull-request must be a pull request number/,
      );
    }
  });
});
