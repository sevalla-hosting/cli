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
})
