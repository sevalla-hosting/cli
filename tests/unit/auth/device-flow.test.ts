import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('Device Flow', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    mock.restoreAll();
  });

  it('should create device code via POST', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(
          JSON.stringify({
            code: 'ABCD1234',
            expires_at: new Date(Date.now() + 300000).toISOString(),
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        ),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const { ApiClient } = await import('../../../src/client/api-client.ts');
    const client = new ApiClient({ baseUrl: 'https://api.test.com' });
    const result = await client.post<{ code: string; expires_at: string }>('/auth/device-codes');

    assert.equal(result.code, 'ABCD1234');
    assert.ok(result.expires_at);
  });

  it('should poll device code status', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({ status: 'pending' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const { ApiClient } = await import('../../../src/client/api-client.ts');
    const client = new ApiClient({ baseUrl: 'https://api.test.com' });
    const result = await client.get<{ status: string }>('/auth/device-codes/ABCD1234');

    assert.equal(result.status, 'pending');
  });

  it('should return token on approval', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({ status: 'approved', token: 'svl_abc123' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const { ApiClient } = await import('../../../src/client/api-client.ts');
    const client = new ApiClient({ baseUrl: 'https://api.test.com' });
    const result = await client.get<{ status: string; token?: string }>(
      '/auth/device-codes/ABCD1234',
    );

    assert.equal(result.status, 'approved');
    assert.equal(result.token, 'svl_abc123');
  });
});
