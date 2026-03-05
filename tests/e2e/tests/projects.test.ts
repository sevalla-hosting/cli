import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDeleteApp, safeDelete } from '../helpers/cleanup.ts'

interface Project {
  id: string
  display_name: string
  created_at?: string
  [key: string]: unknown
}

describe('projects', () => {
  const ts = Date.now()
  let createdProjectId: string | undefined
  let secondProjectId: string | undefined
  let appId: string | undefined
  let clusterId: string | undefined

  before(async () => {
    const res = await sevalla(['api-keys', 'validate'])
    assert.equal(res.exitCode, 0, `api-keys validate failed: ${res.stderr}`)

    // Get cluster for app creation
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
    if (createdProjectId) {
      await safeDelete(['projects'], createdProjectId)
    }
    if (secondProjectId) {
      await safeDelete(['projects'], secondProjectId)
    }
  })

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------
  it('should list projects', async () => {
    const res = await sevalla(['projects', 'list'])
    assert.equal(res.exitCode, 0, `projects list failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<Project[]>()))
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create a project', async () => {
    const projectName = `e2e-project-${ts}`
    const res = await sevalla(['projects', 'create', '--name', projectName])
    assert.equal(res.exitCode, 0, `projects create failed: ${res.stderr}`)
    const project = res.json<Project>()
    assert.ok(project.id)
    assert.equal(project.display_name, projectName)
    createdProjectId = project.id
  })

  it('should create a second project for delete testing', async () => {
    const res = await sevalla(['projects', 'create', '--name', `e2e-project-2nd-${ts}`])
    assert.equal(res.exitCode, 0)
    secondProjectId = res.json<Project>().id
  })

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  it('should get a project by ID', async () => {
    assert.ok(createdProjectId, 'createdProjectId must be set')
    const res = await sevalla(['projects', 'get', createdProjectId])
    assert.equal(res.exitCode, 0, `projects get failed: ${res.stderr}`)
    assert.equal(res.json<Project>().id, createdProjectId)
  })

  it('should fail to get a non-existent project', async () => {
    const res = await sevalla(['projects', 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update a project', async () => {
    assert.ok(createdProjectId, 'createdProjectId must be set')
    const updatedName = `e2e-project-updated-${ts}`
    const res = await sevalla(['projects', 'update', createdProjectId, '--name', updatedName])
    assert.equal(res.exitCode, 0, `projects update failed: ${res.stderr}`)
    assert.equal(res.json<Project>().display_name, updatedName)
  })

  // ---------------------------------------------------------------------------
  // Services - add/remove app from project
  // ---------------------------------------------------------------------------
  it('should create an app for service tests', async () => {
    assert.ok(clusterId, 'clusterId must be set')
    const res = await sevalla([
      'apps', 'create',
      '--name', `e2e-proj-svc-app-${ts}`,
      '--cluster', clusterId,
      '--source', 'dockerImage',
      '--docker-image', 'nginx:latest',
    ])
    assert.equal(res.exitCode, 0, `apps create failed: ${res.stderr}`)
    appId = res.json<{ id: string }>().id
  })

  it('should add an app service to the project', async () => {
    assert.ok(createdProjectId, 'createdProjectId must be set')
    assert.ok(appId, 'appId must be set')
    const res = await sevalla([
      'projects', 'services', 'add', createdProjectId,
      '--service-id', appId,
      '--service-type', 'app',
    ])
    assert.equal(res.exitCode, 0, `services add failed: ${res.stderr}`)
  })

  it('should remove an app service from the project', async () => {
    assert.ok(createdProjectId, 'createdProjectId must be set')
    assert.ok(appId, 'appId must be set')
    const res = await sevalla([
      'projects', 'services', 'remove', createdProjectId, appId,
      '--service-type', 'app',
      '--confirm',
    ])
    assert.equal(res.exitCode, 0, `services remove failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete a project', async () => {
    assert.ok(secondProjectId, 'secondProjectId must be set')
    const res = await sevalla(['projects', 'delete', secondProjectId, '--confirm'])
    assert.equal(res.exitCode, 0, `projects delete failed: ${res.stderr}`)
    const body = res.json<{ deleted: boolean; id: string }>()
    assert.equal(body.deleted, true)
    assert.equal(body.id, secondProjectId)
    secondProjectId = undefined
  })
})
