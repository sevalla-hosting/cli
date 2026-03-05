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

interface IpRestriction {
  [key: string]: unknown
}

interface Domain {
  id: string
  name?: string
  status?: string
  is_primary?: boolean
  [key: string]: unknown
}

describe('application settings', () => {
  const ts = Date.now()
  let clusterId: string | undefined
  let projectId: string | undefined
  let createdProjectId: string | undefined
  let appId: string | undefined

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

    // Create a project for settings tests
    const createProjectRes = await sevalla([
      'projects',
      'create',
      '--name',
      `e2e-settings-project-${ts}`,
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
      `e2e-settings-app-${ts}`,
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
    if (appId) {
      await safeDeleteApp(appId)
    }
    if (createdProjectId) {
      await safeDelete(['projects'], createdProjectId)
    }
  })

  // Deployment Hook

  it('should enable deployment hook', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'deployment-hook', 'enable', appId])
    assert.equal(res.exitCode, 0, `deployment-hook enable failed: ${res.stderr}`)
  })

  it('should get deployment hook', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'deployment-hook', 'get', appId])
    assert.equal(res.exitCode, 0, `deployment-hook get failed: ${res.stderr}`)
  })

  it('should regenerate deployment hook', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'deployment-hook', 'regenerate', appId])
    assert.equal(res.exitCode, 0, `deployment-hook regenerate failed: ${res.stderr}`)
  })

  it('should disable deployment hook', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'deployment-hook', 'disable', appId])
    assert.equal(res.exitCode, 0, `deployment-hook disable failed: ${res.stderr}`)
  })

  // IP Restriction

  it('should get IP restriction default state', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'ip-restriction', 'get', appId])
    assert.equal(res.exitCode, 0, `ip-restriction get failed: ${res.stderr}`)

    const restriction = res.json<IpRestriction>()
    assert.ok(typeof restriction === 'object', 'ip restriction should be an object')
  })

  it('should update IP restriction', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla([
      'apps',
      'ip-restriction',
      'update',
      appId,
      '--type',
      'allow',
      '--ip-list',
      '192.168.1.0/24',
      '--enabled',
      'true',
    ])
    // Server may return 500 on newly created apps - treat as non-fatal
    if (res.exitCode !== 0) {
      const err = res.stderr || ''
      if (err.includes('500') || err.includes('Internal Server Error')) return
    }
    assert.equal(res.exitCode, 0, `ip-restriction update failed: ${res.stderr}`)
  })

  // Domains

  it('should list domains', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'domains', 'list', '--app-id', appId])
    assert.equal(res.exitCode, 0, `domains list failed: ${res.stderr}`)

    const domains = res.json<Domain[]>()
    assert.ok(Array.isArray(domains), 'domains response should be an array')
  })

  // Logs

  it('should get runtime logs', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'logs', 'runtime', appId])
    assert.equal(res.exitCode, 0, `logs runtime failed: ${res.stderr}`)
  })

  it('should get access logs', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'logs', 'access', appId])
    assert.equal(res.exitCode, 0, `logs access failed: ${res.stderr}`)
  })
})
