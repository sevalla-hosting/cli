import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla, refusedOnStateOnly } from '../helpers/cli.ts'
import { safeDelete, safeDeleteApp } from '../helpers/cleanup.ts'

const RESOURCE = 'databases'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForDbReady(dbId: string, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await sevalla([RESOURCE, 'get', dbId])
    if (res.exitCode === 0) {
      const data = res.json<{ status?: string }>()
      if (data.status === 'ready') return 'ready'
    }
    await sleep(3000)
  }
  throw new Error(`Database did not reach ready status within ${maxAttempts * 3}s`)
}

async function waitForDbTerminal(dbId: string, maxAttempts = 60) {
  const terminal = ['ready', 'suspended', 'error']
  for (let i = 0; i < maxAttempts; i++) {
    const res = await sevalla([RESOURCE, 'get', dbId])
    if (res.exitCode === 0) {
      const data = res.json<{ status?: string }>()
      if (data.status && terminal.includes(data.status)) return data.status
    }
    await sleep(3000)
  }
  throw new Error('Database did not reach terminal status')
}

describe(RESOURCE, () => {
  let createdId: string | undefined
  let projectId: string
  let clusterId: string
  let resourceTypeId: string
  let appId: string | undefined

  before(async () => {
    const projName = `e2e-db-proj-${Date.now()}`
    const projRes = await sevalla(['projects', 'create', '--name', projName])
    assert.equal(projRes.exitCode, 0, `Failed to create project: ${projRes.stderr}`)
    projectId = projRes.json<{ id: string }>().id

    const clusterRes = await sevalla(['resources', 'clusters'])
    assert.equal(clusterRes.exitCode, 0)
    const clusters = clusterRes.json<{ id: string }[]>()
    assert.ok(clusters.length > 0)
    clusterId = (clusters[0] as { id: string }).id

    const dbTypesRes = await sevalla(['resources', 'db-types'])
    assert.equal(dbTypesRes.exitCode, 0)
    const dbTypes = dbTypesRes.json<{ id: string }[]>()
    assert.ok(dbTypes.length > 0)
    resourceTypeId = (dbTypes[0] as { id: string }).id

    // Target for internal connection tests
    const appRes = await sevalla([
      'apps', 'create',
      '--name', `e2e-db-conn-app-${Date.now()}`,
      '--project', projectId,
      '--cluster', clusterId,
      '--source', 'dockerImage',
      '--docker-image', 'nginx:latest',
    ])
    assert.equal(appRes.exitCode, 0, `apps create failed: ${appRes.stderr}`)
    appId = appRes.json<{ id: string }>().id
  })

  after(async () => {
    if (appId) {
      await safeDeleteApp(appId)
    }
    if (createdId) {
      await waitForDbTerminal(createdId).catch(() => {})
      await safeDelete([RESOURCE], createdId)
    }
    if (projectId) {
      await safeDelete(['projects'], projectId)
    }
  })

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------
  it('should list databases', async () => {
    const res = await sevalla([RESOURCE, 'list'])
    assert.equal(res.exitCode, 0, `list failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<unknown[]>()))
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create a database', async () => {
    const name = `e2e-db-${Date.now()}`
    const res = await sevalla([
      RESOURCE, 'create',
      '--name', name,
      '--type', 'postgresql',
      '--db-version', '17',
      '--cluster', clusterId,
      '--resource-type', resourceTypeId,
      '--db-name', 'e2e_test_db',
      '--db-password', 'E2eTestPass1234',
      '--project', projectId,
    ], { timeout: 120_000 })
    assert.equal(res.exitCode, 0, `create failed: ${res.stderr}`)
    const created = res.json<{ id: string }>()
    assert.ok(created.id)
    createdId = created.id
  })

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  it('should get a database by id', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'get', createdId])
    assert.equal(res.exitCode, 0, `get failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  it('should return exit code 1 for non-existent database', async () => {
    const res = await sevalla([RESOURCE, 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Wait for ready
  // ---------------------------------------------------------------------------
  it('should wait for database to be ready', async () => {
    assert.ok(createdId, 'No database was created')
    const status = await waitForDbReady(createdId)
    assert.equal(status, 'ready')
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update a database display-name', async () => {
    assert.ok(createdId, 'No database was created')
    const updatedName = `e2e-db-updated-${Date.now()}`
    const res = await sevalla([RESOURCE, 'update', createdId, '--display-name', updatedName])
    assert.equal(res.exitCode, 0, `update failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  // ---------------------------------------------------------------------------
  // Storage metrics
  // ---------------------------------------------------------------------------
  it('should get storage metrics', async () => {
    assert.ok(createdId, 'No database was created')
    for (const metric of ['all-storage', 'used-storage']) {
      const res = await sevalla([RESOURCE, 'metrics', metric, createdId])
      assert.equal(res.exitCode, 0, `metrics ${metric} failed: ${res.stderr}`)
      assert.equal(typeof res.json<{ value: number }>().value, 'number')
    }
  })

  // ---------------------------------------------------------------------------
  // IP Restriction
  // ---------------------------------------------------------------------------
  it('should get IP restriction', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'ip-restriction', 'get', createdId])
    assert.equal(res.exitCode, 0, `ip-restriction get failed: ${res.stderr}`)
  })

  it('should update IP restriction', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([
      RESOURCE, 'ip-restriction', 'update', createdId,
      '--type', 'allow',
      '--ip-list', '8.8.8.8,1.1.1.0/24',
      '--enabled', 'false',
    ])
    assert.equal(res.exitCode, 0, `ip-restriction update failed: ${res.stderr}`)
    await waitForDbReady(createdId)
  })

  // ---------------------------------------------------------------------------
  // Internal Connections
  // ---------------------------------------------------------------------------
  it('should list internal connections', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'connections', 'internal-list', '--db-id', createdId])
    assert.equal(res.exitCode, 0, `internal-list failed: ${res.stderr}`)
  })

  it('should create and delete an internal connection', async () => {
    assert.ok(createdId, 'No database was created')
    assert.ok(appId, 'No app was created')
    const res = await sevalla([
      RESOURCE, 'connections', 'internal-create', createdId,
      '--target-id', appId,
      '--target-type', 'app',
    ])
    assert.equal(res.exitCode, 0, `internal-create failed: ${res.stderr}`)

    const listRes = await sevalla([RESOURCE, 'connections', 'internal-list', '--db-id', createdId])
    assert.equal(listRes.exitCode, 0, `internal-list failed: ${listRes.stderr}`)
    const conn = listRes.json<{ id: string; target_id: string }[]>().find((c) => c.target_id === appId)
    assert.ok(conn, 'created connection should be listed')

    const delRes = await sevalla([RESOURCE, 'connections', 'internal-delete', createdId, conn.id, '--confirm'])
    assert.equal(delRes.exitCode, 0, `internal-delete failed: ${delRes.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // External Connection Toggle
  // ---------------------------------------------------------------------------
  it('should toggle external connection on', async () => {
    assert.ok(createdId, 'No database was created')
    await waitForDbReady(createdId)
    const res = await sevalla([RESOURCE, 'connections', 'external-toggle', createdId])
    assert.equal(res.exitCode, 0, `external-toggle failed: ${res.stderr}`)
    await waitForDbReady(createdId)
  })

  it('should toggle external connection off', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'connections', 'external-toggle', createdId])
    assert.equal(res.exitCode, 0, `external-toggle off failed: ${res.stderr}`)
    await waitForDbReady(createdId)
  })

  // ---------------------------------------------------------------------------
  // Backups
  // ---------------------------------------------------------------------------
  it('should list backups', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'backups', 'list', '--db-id', createdId])
    assert.equal(res.exitCode, 0, `backups list failed: ${res.stderr}`)
  })

  it('should send a backup create request the API accepts', async () => {
    assert.ok(createdId, 'No database was created')
    await waitForDbReady(createdId)
    // Clusters without snapshot backup support refuse on state, but never on request shape
    const res = await sevalla([RESOURCE, 'backups', 'create', createdId, '--name', `e2e-backup-${Date.now()}`])
    assert.ok(refusedOnStateOnly(res), `backups create failed on request shape, auth or crash: ${res.stderr}`)
  })

  it('should restore a backup', async (t) => {
    assert.ok(createdId, 'No database was created')
    const listRes = await sevalla([RESOURCE, 'backups', 'list', '--db-id', createdId])
    assert.equal(listRes.exitCode, 0, `backups list failed: ${listRes.stderr}`)
    const backup = listRes.json<{ id: string }[]>()[0]
    if (!backup) return t.skip('no backup available on this cluster')

    await waitForDbReady(createdId)
    const res = await sevalla([RESOURCE, 'backups', 'restore', createdId, backup.id])
    assert.equal(res.exitCode, 0, `backups restore failed: ${res.stderr}`)
    await waitForDbReady(createdId)
  })

  // ---------------------------------------------------------------------------
  // Reset password
  // ---------------------------------------------------------------------------
  it('should reset the database password', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'reset-password', createdId, '--new-password', 'E2eNewPass5678'])
    assert.equal(res.exitCode, 0, `reset-password failed: ${res.stderr}`)
    await waitForDbReady(createdId)
  })

  // ---------------------------------------------------------------------------
  // Suspend & Activate
  // ---------------------------------------------------------------------------
  it('should suspend the database', async () => {
    assert.ok(createdId, 'No database was created')
    await waitForDbReady(createdId)
    const res = await sevalla([RESOURCE, 'suspend', createdId])
    assert.equal(res.exitCode, 0, `suspend failed: ${res.stderr}`)
    // Wait for suspended state
    for (let i = 0; i < 60; i++) {
      const getRes = await sevalla([RESOURCE, 'get', createdId])
      if (getRes.exitCode === 0) {
        const data = getRes.json<{ status?: string; is_suspended?: boolean }>()
        if (data.is_suspended || data.status === 'suspended') break
      }
      await sleep(3000)
    }
  })

  it('should activate the database', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'activate', createdId])
    assert.equal(res.exitCode, 0, `activate failed: ${res.stderr}`)
    await waitForDbReady(createdId)
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete a database with --confirm', async () => {
    assert.ok(createdId, 'No database was created')
    const res = await sevalla([RESOURCE, 'delete', createdId, '--confirm'], { timeout: 60_000 })
    assert.equal(res.exitCode, 0, `delete failed: ${res.stderr}`)
    const data = res.json<{ deleted: boolean; id: string }>()
    assert.equal(data.deleted, true)
    assert.equal(data.id, createdId)
    createdId = undefined
  })
})
