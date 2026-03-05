import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../../../src/client/api-client.ts';
import type { SevallaApiError } from '../../../src/errors/api-error.ts';

describe('ApiClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    mock.restoreAll();
  });

  it('should make GET requests with auth header', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({ data: 'test' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com/v3', token: 'test-token' });
    const result = await client.get<{ data: string }>('/test');

    assert.deepEqual(result, { data: 'test' });
    assert.equal(mockFetch.mock.calls.length, 1);

    const [url, opts] = mockFetch.mock.calls[0]?.arguments as [string, RequestInit];
    assert.equal(url, 'https://api.test.com/v3/test');
    assert.equal((opts.headers as Record<string, string>)['Authorization'], 'Bearer test-token');
    assert.equal(opts.method, 'GET');
  });

  it('should make POST requests with body', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({ id: '123' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com', token: 'tok' });
    const result = await client.post<{ id: string }>('/items', { name: 'test' });

    assert.deepEqual(result, { id: '123' });
    const [, opts] = mockFetch.mock.calls[0]?.arguments as [string, RequestInit];
    assert.equal(opts.method, 'POST');
    assert.equal(opts.body, JSON.stringify({ name: 'test' }));
    assert.equal((opts.headers as Record<string, string>)['Content-Type'], 'application/json');
  });

  it('should handle 204 No Content', async () => {
    const mockFetch = mock.fn(async () => new Response(null, { status: 204 }));
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com', token: 'tok' });
    const result = await client.delete<undefined>('/items/123');

    assert.equal(result, undefined);
  });

  it('should throw SevallaApiError on error responses', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(
          JSON.stringify({ message: 'Not Found', status: 404, data: { code: 'NOT_FOUND' } }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        ),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com', token: 'tok' });

    await assert.rejects(
      () => client.get('/items/999'),
      (error: SevallaApiError) => {
        assert.equal(error.status, 404);
        assert.equal(error.message, 'Not Found');
        assert.equal(error.data?.code, 'NOT_FOUND');
        return true;
      },
    );
  });

  it('should build URL with query params', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com/v3' });
    await client.get('/items', { page: 1, per_page: 25, filter: undefined });

    const [url] = mockFetch.mock.calls[0]?.arguments as [string];
    assert.equal(url, 'https://api.test.com/v3/items?page=1&per_page=25');
  });

  it('should handle non-JSON error responses', async () => {
    const mockFetch = mock.fn(async () => new Response('Internal Server Error', { status: 500 }));
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com' });

    await assert.rejects(
      () => client.get('/broken'),
      (error: SevallaApiError) => {
        assert.equal(error.status, 500);
        return true;
      },
    );
  });

  it('should make PATCH requests', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({ updated: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com', token: 'tok' });
    await client.patch('/items/123', { name: 'updated' });

    const [, opts] = mockFetch.mock.calls[0]?.arguments as [string, RequestInit];
    assert.equal(opts.method, 'PATCH');
  });

  it('should make PUT requests', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({ updated: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com', token: 'tok' });
    await client.put('/items/123', { value: 'new' });

    const [, opts] = mockFetch.mock.calls[0]?.arguments as [string, RequestInit];
    assert.equal(opts.method, 'PUT');
  });

  it('should reject path traversal in API paths', async () => {
    const client = new ApiClient({ baseUrl: 'https://api.test.com', token: 'tok' });
    await assert.rejects(
      () => client.get('/applications/../etc/passwd'),
      (error: Error) => {
        assert.ok(error.message.includes('Path traversal'));
        return true;
      },
    );
  });

  it('should not set Authorization header when no token', async () => {
    const mockFetch = mock.fn(
      async () =>
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    globalThis.fetch = mockFetch as typeof fetch;

    const client = new ApiClient({ baseUrl: 'https://api.test.com' });
    await client.get('/public');

    const [, opts] = mockFetch.mock.calls[0]?.arguments as [string, RequestInit];
    assert.equal((opts.headers as Record<string, string>)['Authorization'], undefined);
  });
});
