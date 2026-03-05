import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDeleteApp, safeDelete } from '../helpers/cleanup.ts'

interface Cluster {
  id: string
  name: string
  [key: string]: unknown
}

interface Project {
  id: string
  display_name: string
  [key: string]: unknown
}

interface App {
  id: string
  display_name?: string
  status?: string
  created_at?: string
  type?: string
  [key: string]: unknown
}

describe('applications', () => {
  const ts = Date.now()
  let clusterId: string | undefined
  let projectId: string | undefined
  let createdAppId: string | undefined
  let createdProjectId: string | undefined

  before(async () => {
    // Validate API key to ensure credentials are working
    const validateRes = await sevalla(['api-keys', 'validate'])
    assert.equal(validateRes.exitCode, 0, `api-keys validate failed: ${validateRes.stderr}`)

    // Get a cluster ID
    const clustersRes = await sevalla(['resources', 'clusters'])
    assert.equal(clustersRes.exitCode, 0, `resources clusters failed: ${clustersRes.stderr}`)
    const clusters = clustersRes.json<Cluster[]>()
    assert.ok(Array.isArray(clusters), 'clusters response should be an array')
    assert.ok(clusters.length > 0, 'at least one cluster must exist')
    clusterId = (clusters[0] as Cluster).id

    // List existing projects; create one if none exist
    const projectsRes = await sevalla(['projects', 'list'])
    assert.equal(projectsRes.exitCode, 0, `projects list failed: ${projectsRes.stderr}`)
    const projects = projectsRes.json<Project[]>()

    if (projects.length > 0) {
      projectId = (projects[0] as Project).id
    } else {
      const createProjectRes = await sevalla([
        'projects',
        'create',
        '--name',
        `e2e-app-test-project-${ts}`,
      ])
      assert.equal(createProjectRes.exitCode, 0, `projects create failed: ${createProjectRes.stderr}`)
      const project = createProjectRes.json<Project>()
      projectId = project.id
      createdProjectId = project.id
    }
  })

  after(async () => {
    if (createdAppId) {
      await safeDeleteApp(createdAppId)
    }
    if (createdProjectId) {
      await safeDelete(['projects'], createdProjectId)
    }
  })

  it('should list applications', async () => {
    const res = await sevalla(['apps', 'list'])
    assert.equal(res.exitCode, 0, `apps list failed: ${res.stderr}`)
    const apps = res.json<App[]>()
    assert.ok(Array.isArray(apps), 'response should be an array')
  })

  it('should create an application', async () => {
    assert.ok(projectId, 'projectId must be set from before hook')
    assert.ok(clusterId, 'clusterId must be set from before hook')

    const appName = `e2e-app-${ts}`
    const res = await sevalla([
      'apps',
      'create',
      '--name',
      appName,
      '--project',
      projectId,
      '--cluster',
      clusterId,
      '--source',
      'dockerImage',
      '--docker-image',
      'nginx:latest',
    ])
    assert.equal(res.exitCode, 0, `apps create failed: ${res.stderr}`)

    const app = res.json<App>()
    assert.ok(app.id, 'created app should have an id')
    assert.ok(app.created_at, 'created app should have created_at')
    createdAppId = app.id
  })

  it('should get a created application by ID', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from create test')

    const res = await sevalla(['apps', 'get', createdAppId])
    assert.equal(res.exitCode, 0, `apps get failed: ${res.stderr}`)

    const app = res.json<App>()
    assert.equal(app.id, createdAppId, 'returned app id should match')
  })

  it('should fail to get a non-existent application', async () => {
    const res = await sevalla(['apps', 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1, 'getting a non-existent app should exit with code 1')
  })

  it('should update an application display name', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from create test')

    const updatedName = `e2e-app-updated-${ts}`
    const res = await sevalla([
      'apps',
      'update',
      createdAppId,
      '--display-name',
      updatedName,
    ])
    assert.equal(res.exitCode, 0, `apps update failed: ${res.stderr}`)

    const app = res.json<App>()
    assert.equal(app.id, createdAppId, 'updated app id should match')
  })

  it('should delete an application', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from create test')

    const res = await sevalla(['apps', 'delete', createdAppId, '--confirm'])
    assert.equal(res.exitCode, 0, `apps delete failed: ${res.stderr}`)

    const body = res.json<{ deleted: boolean; id: string }>()
    assert.equal(body.deleted, true, 'deleted should be true')
    assert.equal(body.id, createdAppId, 'deleted id should match')

    // Clear so after hook does not attempt cleanup
    createdAppId = undefined
  })
})
