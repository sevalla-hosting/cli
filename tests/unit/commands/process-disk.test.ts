import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { processDiskDeleteCommand } from '../../../src/commands/apps/processes/disk/delete.ts';
import { processDiskUpdateCommand } from '../../../src/commands/apps/processes/disk/update.ts';

describe('Process disk commands', () => {
  let fetchMock: ReturnType<typeof mock.fn>;

  beforeEach(() => {
    process.env['SEVALLA_API_TOKEN'] = 'tok';
    fetchMock = mock.fn(async () => new Response('{}', { status: 200 }));
    mock.method(globalThis, 'fetch', fetchMock);
    mock.method(process, 'exit', () => {
      throw new Error('exit');
    });
    mock.method(console, 'error', () => {});
    mock.method(console, 'log', () => {});
  });

  afterEach(() => {
    mock.restoreAll();
  });

  for (const [processId, appId] of [
    ['p1#', 'a1'],
    ['p1', 'a1?x'],
    ['p1/../..', 'a1'],
  ]) {
    it(`should send no request for process ${processId} and app ${appId}`, async () => {
      await assert.rejects(() =>
        processDiskDeleteCommand.parseAsync([processId, '--app-id', appId, '--confirm', '--json'], {
          from: 'user',
        }),
      );
      await assert.rejects(() =>
        processDiskUpdateCommand.parseAsync(
          [
            processId,
            '--app-id',
            appId,
            '--resource-type',
            'd1',
            '--mount-path',
            '/var/lib/data',
            '--json',
          ],
          { from: 'user' },
        ),
      );
      assert.equal(fetchMock.mock.callCount(), 0);
    });
  }
});
