import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDelete } from '../helpers/cleanup.ts'

interface ApiKey {
  id: string
  name: string
  key?: string
  token?: string
  enabled?: boolean
  expires_at?: string | null
  created_at?: string
  [key: string]: unknown
}

describe('api-keys', () => {
  const ts = Date.now()
  let createdKeyId: string | undefined

  before(async () => {
    const res = await sevalla(['api-keys', 'validate'])
    assert.equal(res.exitCode, 0, `api-keys validate failed: ${res.stderr}`)
  })

  after(async () => {
    if (createdKeyId) {
      await safeDelete(['api-keys'], createdKeyId)
    }
  })

  // ---------------------------------------------------------------------------
  // Validate
  // ---------------------------------------------------------------------------
  it('should validate the current API key', async () => {
    const res = await sevalla(['api-keys', 'validate'])
    assert.equal(res.exitCode, 0, `api-keys validate failed: ${res.stderr}`)
    const data = res.json<Record<string, unknown>>()
    assert.ok(data, 'validate should return data')
    assert.ok(data.id || data.company_id || data.company, 'validate response should contain identification')
  })

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------
  it('should list API keys', async () => {
    const res = await sevalla(['api-keys', 'list'])
    assert.equal(res.exitCode, 0, `api-keys list failed: ${res.stderr}`)
    const keys = res.json<ApiKey[]>()
    assert.ok(Array.isArray(keys), 'response should be an array')
    assert.ok(keys.length > 0, 'there should be at least one API key')
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create an API key', async () => {
    const keyName = `e2e-api-key-${ts}`
    const res = await sevalla([
      'api-keys', 'create',
      '--name', keyName,
      '--capabilities', 'APP:READ',
    ])
    assert.equal(res.exitCode, 0, `api-keys create failed: ${res.stderr}`)

    const createResult = res.json<{ token?: string; name?: string }>()
    assert.ok(createResult.token || createResult.name, 'create response should have token or name')

    // The create response only returns {token, name}; list keys to find the ID
    const listRes = await sevalla(['api-keys', 'list'])
    assert.equal(listRes.exitCode, 0)
    const keys = listRes.json<ApiKey[]>()
    const created = keys.find((k) => k.name === keyName)
    assert.ok(created, `created key "${keyName}" should appear in the list`)
    createdKeyId = created.id
  })

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  it('should get an API key by ID', async () => {
    assert.ok(createdKeyId, 'createdKeyId must be set')
    const res = await sevalla(['api-keys', 'get', createdKeyId])
    assert.equal(res.exitCode, 0, `api-keys get failed: ${res.stderr}`)
    const key = res.json<ApiKey>()
    assert.equal(key.id, createdKeyId)
  })

  it('should fail to get a non-existent API key', async () => {
    const res = await sevalla(['api-keys', 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update an API key name', async () => {
    assert.ok(createdKeyId, 'createdKeyId must be set')
    const updatedName = `e2e-api-key-updated-${ts}`
    const res = await sevalla(['api-keys', 'update', createdKeyId, '--name', updatedName])
    assert.equal(res.exitCode, 0, `api-keys update failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Toggle
  // ---------------------------------------------------------------------------
  it('should toggle API key to disabled', async () => {
    assert.ok(createdKeyId, 'createdKeyId must be set')
    const res = await sevalla(['api-keys', 'toggle', createdKeyId])
    assert.equal(res.exitCode, 0, `api-keys toggle failed: ${res.stderr}`)
  })

  it('should toggle API key back to enabled', async () => {
    assert.ok(createdKeyId, 'createdKeyId must be set')
    const res = await sevalla(['api-keys', 'toggle', createdKeyId])
    assert.equal(res.exitCode, 0, `api-keys toggle failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Rotate
  // ---------------------------------------------------------------------------
  it('should rotate an API key', async () => {
    assert.ok(createdKeyId, 'createdKeyId must be set')
    const res = await sevalla(['api-keys', 'rotate', createdKeyId])
    assert.equal(res.exitCode, 0, `api-keys rotate failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete an API key', async () => {
    assert.ok(createdKeyId, 'createdKeyId must be set')
    const res = await sevalla(['api-keys', 'delete', createdKeyId, '--confirm'])
    assert.equal(res.exitCode, 0, `api-keys delete failed: ${res.stderr}`)
    const body = res.json<{ deleted: boolean; id: string }>()
    assert.equal(body.deleted, true)
    assert.equal(body.id, createdKeyId)
    createdKeyId = undefined
  })
})
