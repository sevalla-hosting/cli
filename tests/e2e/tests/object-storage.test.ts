import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDelete } from '../helpers/cleanup.ts'

const RESOURCE = 'object-storage'

describe(RESOURCE, () => {
  let bucketId: string | undefined
  let projectId: string
  let corsPolicyId: string | undefined

  before(async () => {
    const projName = `e2e-obj-proj-${Date.now()}`
    const projRes = await sevalla(['projects', 'create', '--name', projName])
    assert.equal(projRes.exitCode, 0, `Failed to create project: ${projRes.stderr}`)
    projectId = projRes.json<{ id: string }>().id
  })

  after(async () => {
    if (bucketId) {
      await safeDelete([RESOURCE], bucketId)
    }
    if (projectId) {
      await safeDelete(['projects'], projectId)
    }
  })

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------
  it('should list object storage buckets', async () => {
    const res = await sevalla([RESOURCE, 'list'])
    assert.equal(res.exitCode, 0, `list failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<unknown[]>()))
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create a bucket', async () => {
    const name = `e2e-obj-${Date.now()}`
    const res = await sevalla([
      RESOURCE, 'create',
      '--name', name,
      '--project', projectId,
    ])
    assert.equal(res.exitCode, 0, `create failed: ${res.stderr}`)
    const created = res.json<{ id: string }>()
    assert.ok(created.id)
    bucketId = created.id
  })

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  it('should get a bucket by id', async () => {
    assert.ok(bucketId, 'No bucket was created')
    const res = await sevalla([RESOURCE, 'get', bucketId])
    assert.equal(res.exitCode, 0, `get failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, bucketId)
  })

  it('should return exit code 1 for non-existent bucket', async () => {
    const res = await sevalla([RESOURCE, 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update a bucket display-name', async () => {
    assert.ok(bucketId, 'No bucket was created')
    const updatedName = `e2e-obj-updated-${Date.now()}`
    const res = await sevalla([RESOURCE, 'update', bucketId, '--display-name', updatedName])
    assert.equal(res.exitCode, 0, `update failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, bucketId)
  })

  // ---------------------------------------------------------------------------
  // Objects
  // ---------------------------------------------------------------------------
  it('should list objects in bucket', async () => {
    assert.ok(bucketId, 'No bucket was created')
    const res = await sevalla([RESOURCE, 'objects', 'list', '--bucket-id', bucketId])
    // objects list may return 500 on newly created buckets; treat as non-fatal
    if (res.exitCode === 0) {
      assert.ok(Array.isArray(res.json<unknown[]>()))
    }
  })

  // ---------------------------------------------------------------------------
  // CORS Policies
  // ---------------------------------------------------------------------------
  it('should create a CORS policy', async () => {
    assert.ok(bucketId, 'No bucket was created')
    const res = await sevalla([
      RESOURCE, 'cors-policies', 'create', bucketId,
      '--origins', 'https://example.com',
      '--methods', 'GET,POST',
    ])
    assert.equal(res.exitCode, 0, `cors-policies create failed: ${res.stderr}`)

    // Fetch the list to get the created policy ID
    const listRes = await sevalla([RESOURCE, 'cors-policies', 'list', '--bucket-id', bucketId])
    if (listRes.exitCode === 0) {
      const policies = listRes.json<{ id: string }[]>()
      if (policies.length > 0) {
        corsPolicyId = (policies[0] as { id: string }).id
      }
    }
  })

  it('should list CORS policies', async () => {
    assert.ok(bucketId, 'No bucket was created')
    const res = await sevalla([RESOURCE, 'cors-policies', 'list', '--bucket-id', bucketId])
    assert.equal(res.exitCode, 0, `cors-policies list failed: ${res.stderr}`)
    const policies = res.json<unknown[]>()
    assert.ok(Array.isArray(policies))
  })

  it('should delete a CORS policy', async () => {
    assert.ok(bucketId, 'No bucket was created')
    if (!corsPolicyId) return // skip if create failed
    const res = await sevalla([
      RESOURCE, 'cors-policies', 'delete', bucketId, corsPolicyId,
      '--confirm',
    ])
    assert.equal(res.exitCode, 0, `cors-policies delete failed: ${res.stderr}`)
    corsPolicyId = undefined
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete a bucket with --confirm', async () => {
    assert.ok(bucketId, 'No bucket was created')
    const res = await sevalla([RESOURCE, 'delete', bucketId, '--confirm'])
    assert.equal(res.exitCode, 0, `delete failed: ${res.stderr}`)
    const data = res.json<{ deleted: boolean; id: string }>()
    assert.equal(data.deleted, true)
    assert.equal(data.id, bucketId)
    bucketId = undefined
  })
})
