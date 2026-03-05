import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDelete, safeDeleteApp } from '../helpers/cleanup.ts'

const RESOURCE = 'pipelines'

describe(RESOURCE, () => {
  let createdId: string | undefined
  let projectId: string
  let clusterId: string
  let stageId: string | undefined
  let appId: string | undefined

  before(async () => {
    const projName = `e2e-pipe-proj-${Date.now()}`
    const projRes = await sevalla(['projects', 'create', '--name', projName])
    assert.equal(projRes.exitCode, 0, `Failed to create project: ${projRes.stderr}`)
    projectId = projRes.json<{ id: string }>().id

    const clusterRes = await sevalla(['resources', 'clusters'])
    assert.equal(clusterRes.exitCode, 0)
    const clusters = clusterRes.json<{ id: string }[]>()
    assert.ok(clusters.length > 0)
    clusterId = (clusters[0] as { id: string }).id
  })

  after(async () => {
    if (appId) {
      await safeDeleteApp(appId)
    }
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
  it('should list pipelines', async () => {
    const res = await sevalla([RESOURCE, 'list'])
    assert.equal(res.exitCode, 0, `list failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<unknown[]>()))
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create a pipeline', async () => {
    const name = `e2e-pipeline-${Date.now()}`
    const res = await sevalla([
      RESOURCE, 'create',
      '--name', name,
      '--type', 'trunk',
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
  it('should get a pipeline by id', async () => {
    assert.ok(createdId, 'No pipeline was created')
    const res = await sevalla([RESOURCE, 'get', createdId])
    assert.equal(res.exitCode, 0, `get failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  it('should return exit code 1 for non-existent pipeline', async () => {
    const res = await sevalla([RESOURCE, 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update a pipeline name', async () => {
    assert.ok(createdId, 'No pipeline was created')
    const updatedName = `e2e-pipeline-updated-${Date.now()}`
    const res = await sevalla([RESOURCE, 'update', createdId, '--name', updatedName])
    assert.equal(res.exitCode, 0, `update failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  // ---------------------------------------------------------------------------
  // Stages
  // ---------------------------------------------------------------------------
  it('should create a stage', async () => {
    assert.ok(createdId, 'No pipeline was created')
    const res = await sevalla([
      RESOURCE, 'stages', 'create', createdId,
      '--name', `e2e-stage-${Date.now()}`,
    ])
    assert.equal(res.exitCode, 0, `stages create failed: ${res.stderr}`)
    const stage = res.json<{ id: string }>()
    assert.ok(stage.id)
    stageId = stage.id
  })

  // ---------------------------------------------------------------------------
  // Stage Apps
  // ---------------------------------------------------------------------------
  it('should create an app for stage tests', async () => {
    const res = await sevalla([
      'apps', 'create',
      '--name', `e2e-pipe-app-${Date.now()}`,
      '--cluster', clusterId,
      '--source', 'dockerImage',
      '--docker-image', 'nginx:latest',
    ])
    assert.equal(res.exitCode, 0, `apps create failed: ${res.stderr}`)
    appId = res.json<{ id: string }>().id
  })

  it('should add an app to a stage', async () => {
    assert.ok(createdId, 'No pipeline was created')
    assert.ok(stageId, 'No stage was created')
    assert.ok(appId, 'No app was created')
    const res = await sevalla([
      RESOURCE, 'stages', 'apps', 'add', createdId, stageId, appId,
    ])
    assert.equal(res.exitCode, 0, `stages apps add failed: ${res.stderr}`)
  })

  it('should remove an app from a stage', async () => {
    assert.ok(createdId, 'No pipeline was created')
    assert.ok(stageId, 'No stage was created')
    assert.ok(appId, 'No app was created')
    const res = await sevalla([
      RESOURCE, 'stages', 'apps', 'remove', createdId, stageId, appId,
      '--confirm',
    ])
    assert.equal(res.exitCode, 0, `stages apps remove failed: ${res.stderr}`)
  })

  it('should delete a stage', async () => {
    assert.ok(createdId, 'No pipeline was created')
    assert.ok(stageId, 'No stage was created')
    const res = await sevalla([
      RESOURCE, 'stages', 'delete', createdId, stageId,
      '--confirm',
    ])
    assert.equal(res.exitCode, 0, `stages delete failed: ${res.stderr}`)
    stageId = undefined
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete a pipeline with --confirm', async () => {
    assert.ok(createdId, 'No pipeline was created')
    const res = await sevalla([RESOURCE, 'delete', createdId, '--confirm'], { timeout: 60_000 })
    assert.equal(res.exitCode, 0, `delete failed: ${res.stderr}`)
    const data = res.json<{ deleted: boolean; id: string }>()
    assert.equal(data.deleted, true)
    assert.equal(data.id, createdId)
    createdId = undefined
  })
})
