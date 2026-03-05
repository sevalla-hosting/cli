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

describe('application lifecycle', () => {
  const ts = Date.now()
  let clusterId: string | undefined
  let projectId: string | undefined
  let createdProjectId: string | undefined
  let appId: string | undefined
  let clonedAppId: string | undefined
  let dockerAppId: string | undefined

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

    // Create a project for lifecycle tests
    const createProjectRes = await sevalla([
      'projects',
      'create',
      '--name',
      `e2e-lifecycle-project-${ts}`,
    ])
    assert.equal(createProjectRes.exitCode, 0, `projects create failed: ${createProjectRes.stderr}`)
    const project = createProjectRes.json<Project>()
    projectId = project.id
    createdProjectId = project.id

    // Create an app from docker image (faster than git repo)
    assert.ok(projectId, 'projectId must be set')
    assert.ok(clusterId, 'clusterId must be set')

    const createAppRes = await sevalla([
      'apps',
      'create',
      '--name',
      `e2e-lifecycle-app-${ts}`,
      '--project',
      projectId,
      '--cluster',
      clusterId,
      '--source',
      'dockerImage',
      '--docker-image',
      'nginx:latest',
    ])
    assert.equal(createAppRes.exitCode, 0, `apps create failed: ${createAppRes.stderr}`)
    const app = createAppRes.json<App>()
    assert.ok(app.id, 'created app should have an id')
    appId = app.id
  })

  after(async () => {
    if (clonedAppId) {
      await safeDeleteApp(clonedAppId)
    }
    if (dockerAppId) {
      await safeDeleteApp(dockerAppId)
    }
    if (appId) {
      await safeDeleteApp(appId)
    }
    if (createdProjectId) {
      await safeDelete(['projects'], createdProjectId)
    }
  })

  it('should suspend an application', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'suspend', appId])
    assert.equal(res.exitCode, 0, `apps suspend failed: ${res.stderr}`)
  })

  it('should activate an application', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'activate', appId])
    assert.equal(res.exitCode, 0, `apps activate failed: ${res.stderr}`)
  })

  it('should clone an application', async () => {
    assert.ok(appId, 'appId must be set from before hook')
    assert.ok(clusterId, 'clusterId must be set from before hook')

    const res = await sevalla([
      'apps', 'clone', appId,
      '--display-name', `e2e-lifecycle-clone-${ts}`,
      '--cluster', clusterId,
    ])
    assert.equal(res.exitCode, 0, `apps clone failed: ${res.stderr}`)
    const cloned = res.json<App>()
    if (cloned.id) clonedAppId = cloned.id
  })

  it('should create an application from docker image source', async () => {
    assert.ok(projectId, 'projectId must be set from before hook')
    assert.ok(clusterId, 'clusterId must be set from before hook')

    const dockerAppName = `e2e-lifecycle-docker-${ts}`
    const res = await sevalla([
      'apps',
      'create',
      '--name',
      dockerAppName,
      '--project',
      projectId,
      '--cluster',
      clusterId,
      '--source',
      'dockerImage',
      '--docker-image',
      'nginx:latest',
    ])
    assert.equal(res.exitCode, 0, `apps create docker failed: ${res.stderr}`)

    const app = res.json<App>()
    assert.ok(app.id, 'docker app should have an id')
    assert.ok(app.created_at, 'docker app should have created_at')
    dockerAppId = app.id
  })
})
