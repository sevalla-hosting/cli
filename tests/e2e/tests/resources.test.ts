import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'

describe('resources', () => {
  // ---------------------------------------------------------------------------
  // List clusters
  // ---------------------------------------------------------------------------
  it('sevalla resources clusters should return a list of clusters', async () => {
    const res = await sevalla(['resources', 'clusters'])
    assert.equal(res.exitCode, 0)
    const body = res.json<Array<{ id: string; name: string }>>()
    assert.ok(Array.isArray(body), 'expected an array of clusters')
    assert.ok(body.length > 0, 'expected at least one cluster')
    // Each cluster should have an id and name
    for (const cluster of body) {
      assert.ok(typeof cluster.id === 'string', 'cluster.id should be a string')
      assert.ok(typeof cluster.name === 'string', 'cluster.name should be a string')
    }
  })

  // ---------------------------------------------------------------------------
  // List database resource types
  // ---------------------------------------------------------------------------
  it('sevalla resources db-types should return a list of database resource types', async () => {
    const res = await sevalla(['resources', 'db-types'])
    assert.equal(res.exitCode, 0)
    const body = res.json<Array<{ id: string; name: string }>>()
    assert.ok(Array.isArray(body), 'expected an array of db types')
    assert.ok(body.length > 0, 'expected at least one database resource type')
    for (const dbType of body) {
      assert.ok(typeof dbType.id === 'string', 'dbType.id should be a string')
      assert.ok(typeof dbType.name === 'string', 'dbType.name should be a string')
    }
  })

  // ---------------------------------------------------------------------------
  // List process resource types
  // ---------------------------------------------------------------------------
  it('sevalla resources process-types should return a list of process resource types', async () => {
    const res = await sevalla(['resources', 'process-types'])
    assert.equal(res.exitCode, 0)
    const body = res.json<Array<{ id: string; name: string }>>()
    assert.ok(Array.isArray(body), 'expected an array of process types')
    assert.ok(body.length > 0, 'expected at least one process resource type')
    for (const procType of body) {
      assert.ok(typeof procType.id === 'string', 'procType.id should be a string')
      assert.ok(typeof procType.name === 'string', 'procType.name should be a string')
    }
  })

  // ---------------------------------------------------------------------------
  // List disk resource types
  // ---------------------------------------------------------------------------
  it('sevalla resources disk-types should return the disk sizes', async () => {
    const res = await sevalla(['resources', 'disk-types'])
    assert.equal(res.exitCode, 0, `resources disk-types failed: ${res.stderr}`)
    const body = res.json<Array<{ id: string; name: string; size_gib: number }>>()
    assert.ok(Array.isArray(body), 'expected an array of disk types')
    assert.ok(body.length > 0, 'expected at least one disk resource type')
    for (const diskType of body) {
      assert.ok(typeof diskType.id === 'string', 'diskType.id should be a string')
      assert.ok(typeof diskType.size_gib === 'number', 'diskType.size_gib should be a number')
    }
  })

  // ---------------------------------------------------------------------------
  // Non-paginated lists (endpoints without limit/offset)
  // ---------------------------------------------------------------------------
  for (const args of [
    ['resources', 'rbac-permissions'],
    ['resources', 'rbac-roles'],
    ['users', 'list'],
    ['git', 'providers'],
  ]) {
    it(`sevalla ${args.join(' ')} should return a list`, async () => {
      const res = await sevalla(args)
      assert.equal(res.exitCode, 0, `${args.join(' ')} failed: ${res.stderr}`)
      assert.ok(Array.isArray(res.json()), 'expected an array')
    })
  }

  it('sevalla resources db-versions should list versions for a cluster', async () => {
    const clustersRes = await sevalla(['resources', 'clusters'])
    const [cluster] = clustersRes.json<{ id: string }[]>()
    assert.ok(cluster, 'at least one cluster must exist')

    const res = await sevalla(['resources', 'db-versions', '--cluster', cluster.id, '--type', 'postgresql'])
    assert.equal(res.exitCode, 0, `resources db-versions failed: ${res.stderr}`)
    const types = res.json<{ type: string; versions: string[] }[]>()
    assert.deepEqual(types.map((t) => t.type), ['postgresql'])
    assert.ok(types[0]?.versions.length, 'postgresql should have versions')
  })
})
