import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDelete } from '../helpers/cleanup.ts'

const RESOURCE = 'load-balancers'
describe(RESOURCE, () => {
  let createdId: string | undefined
  let projectId: string

  before(async () => {
    const projName = `e2e-lb-proj-${Date.now()}`
    const projRes = await sevalla(['projects', 'create', '--name', projName])
    assert.equal(projRes.exitCode, 0, `Failed to create project: ${projRes.stderr}`)
    projectId = projRes.json<{ id: string }>().id
  })

  after(async () => {
    if (createdId) {
      await safeDelete([RESOURCE], createdId)
    }
    if (projectId) {
      await safeDelete(['projects'], projectId)
    }
  })

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------
  it('should list load balancers', async () => {
    const res = await sevalla([RESOURCE, 'list'])
    assert.equal(res.exitCode, 0, `list failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<unknown[]>()))
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create a load balancer', async () => {
    const name = `e2e-lb-${Date.now()}`
    const res = await sevalla([
      RESOURCE, 'create',
      '--name', name,
      '--project', projectId,
    ], { timeout: 60_000 })
    assert.equal(res.exitCode, 0, `create failed: ${res.stderr}`)
    const created = res.json<{ id: string }>()
    assert.ok(created.id)
    createdId = created.id
  })

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  it('should get a load balancer by id', async () => {
    assert.ok(createdId, 'No LB was created')
    const res = await sevalla([RESOURCE, 'get', createdId])
    assert.equal(res.exitCode, 0, `get failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  it('should return exit code 1 for non-existent load balancer', async () => {
    const res = await sevalla([RESOURCE, 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update a load balancer display-name', async () => {
    assert.ok(createdId, 'No LB was created')
    const updatedName = `e2e-lb-updated-${Date.now()}`
    const res = await sevalla([RESOURCE, 'update', createdId, '--display-name', updatedName])
    assert.equal(res.exitCode, 0, `update failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  // ---------------------------------------------------------------------------
  // Domains
  // ---------------------------------------------------------------------------
  it('should list load balancer domains', async () => {
    assert.ok(createdId, 'No LB was created')
    const res = await sevalla([RESOURCE, 'domains', 'list', '--lb-id', createdId])
    assert.equal(res.exitCode, 0, `domains list failed: ${res.stderr}`)
    const data = res.json<unknown[]>()
    assert.ok(Array.isArray(data))
  })

  // ---------------------------------------------------------------------------
  // Destinations
  // ---------------------------------------------------------------------------
  it('should list load balancer destinations', async () => {
    assert.ok(createdId, 'No LB was created')
    const res = await sevalla([RESOURCE, 'destinations', 'list', '--lb-id', createdId])
    assert.equal(res.exitCode, 0, `destinations list failed: ${res.stderr}`)
    const data = res.json<unknown[]>()
    assert.ok(Array.isArray(data))
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete a load balancer with --confirm', async () => {
    assert.ok(createdId, 'No LB was created')
    const res = await sevalla([RESOURCE, 'delete', createdId, '--confirm'], { timeout: 60_000 })
    assert.equal(res.exitCode, 0, `delete failed: ${res.stderr}`)
    const data = res.json<{ deleted: boolean; id: string }>()
    assert.equal(data.deleted, true)
    assert.equal(data.id, createdId)
    createdId = undefined
  })
})
