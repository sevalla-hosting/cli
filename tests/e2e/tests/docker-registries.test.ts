import { describe, it, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDelete } from '../helpers/cleanup.ts'

const RESOURCE = 'docker-registries'

describe(RESOURCE, () => {
  let createdId: string | undefined

  after(async () => {
    if (createdId) {
      await safeDelete([RESOURCE], createdId)
    }
  })

  it('should list docker registries', async () => {
    const res = await sevalla([RESOURCE, 'list'])
    assert.equal(res.exitCode, 0, `Expected exit code 0, got ${res.exitCode}. stderr: ${res.stderr}`)
    const data = res.json<unknown[]>()
    assert.ok(Array.isArray(data), 'Expected response to be an array')
  })

  it('should create a docker registry', async () => {
    const name = `e2e-registry-${Date.now()}`

    const res = await sevalla([
      RESOURCE, 'create',
      '--name', name,
      '--registry', 'dockerHub',
      '--username', 'e2eTestUser',
      '--secret', 'e2eTestPass1234',
    ], { timeout: 60_000 })
    assert.equal(res.exitCode, 0, `Expected exit code 0, got ${res.exitCode}. stderr: ${res.stderr}`)
    const created = res.json<{ id: string }>()
    assert.ok(created.id, 'Expected created docker registry to have an id')
    createdId = created.id
  })

  it('should get a docker registry by id', async () => {
    assert.ok(createdId, 'No docker registry was created to get')

    const res = await sevalla([RESOURCE, 'get', createdId])
    assert.equal(res.exitCode, 0, `Expected exit code 0, got ${res.exitCode}. stderr: ${res.stderr}`)
    const data = res.json<{ id: string }>()
    assert.equal(data.id, createdId)
  })

  it('should return exit code 1 for non-existent docker registry', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000'

    const res = await sevalla([RESOURCE, 'get', fakeId])
    assert.equal(res.exitCode, 1, `Expected exit code 1, got ${res.exitCode}`)
  })

  it('should update a docker registry name', async () => {
    assert.ok(createdId, 'No docker registry was created to update')

    const updatedName = `e2e-registry-updated-${Date.now()}`
    const res = await sevalla([RESOURCE, 'update', createdId, '--name', updatedName])
    assert.equal(res.exitCode, 0, `Expected exit code 0, got ${res.exitCode}. stderr: ${res.stderr}`)
    const data = res.json<{ id: string }>()
    assert.equal(data.id, createdId)
  })

  it('should delete a docker registry with --confirm', async () => {
    assert.ok(createdId, 'No docker registry was created to delete')

    const res = await sevalla([RESOURCE, 'delete', createdId, '--confirm'], { timeout: 60_000 })
    assert.equal(res.exitCode, 0, `Expected exit code 0, got ${res.exitCode}. stderr: ${res.stderr}`)
    const data = res.json<{ deleted: boolean; id: string }>()
    assert.equal(data.deleted, true)
    assert.equal(data.id, createdId)

    createdId = undefined
  })
})
