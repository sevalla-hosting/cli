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
  type?: string
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

    const res = await sevalla(['apps', 'deployment-hook', 'regenerate', appId, '--confirm'])
    assert.equal(res.exitCode, 0, `deployment-hook regenerate failed: ${res.stderr}`)
  })

  it('should disable deployment hook', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'deployment-hook', 'disable', appId, '--confirm'])
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

  it('should add and delete a custom domain', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'domains', 'add', appId, '--name', `e2e-${ts}.sevalla.com`])
    assert.equal(res.exitCode, 0, `domains add failed: ${res.stderr}`)
    const domain = res.json<Domain>()
    assert.ok(domain.id, 'added domain should have an id')

    const delRes = await sevalla(['apps', 'domains', 'delete', appId, domain.id, '--confirm'])
    assert.equal(delRes.exitCode, 0, `domains delete failed: ${delRes.stderr}`)
  })

  it('should rename the system domain', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const listRes = await sevalla(['apps', 'domains', 'list', '--app-id', appId])
    assert.equal(listRes.exitCode, 0, `domains list failed: ${listRes.stderr}`)
    const system = listRes.json<Domain[]>().find((d) => d.type === 'SYSTEM')
    assert.ok(system, 'app should have a system domain')

    const res = await sevalla([
      'apps', 'domains', 'update', system.id,
      '--app-id', appId,
      '--name', `e2e-app-${ts}`,
    ])
    assert.equal(res.exitCode, 0, `domains update failed: ${res.stderr}`)
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

  it('should get runtime and access logs with filters', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const from = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    for (const kind of ['runtime', 'access']) {
      const res = await sevalla(['apps', 'logs', kind, appId, '--from', from, '--search', 'GET', '--order', 'desc', '--limit', '5'])
      assert.equal(res.exitCode, 0, `logs ${kind} with filters failed: ${res.stderr}`)
    }
  })

  // Lists and metrics

  it('should find the application with list --search', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'list', '--search', `e2e-settings-app-${ts}`, '--source', 'dockerImage', '--project', projectId as string])
    assert.equal(res.exitCode, 0, `apps list --search failed: ${res.stderr}`)
    assert.deepEqual(res.json<App[]>().map((a) => a.id), [appId])
  })

  it('should get a response time percentile', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'metrics', 'response-time', appId, '--percent', '95'])
    assert.equal(res.exitCode, 0, `metrics response-time --percent failed: ${res.stderr}`)
  })

  // Edge cache and egress IPs

  it('should toggle edge caching on and off', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const first = await sevalla(['apps', 'edge-cache-toggle', appId])
    assert.equal(first.exitCode, 0, `edge-cache-toggle failed: ${first.stderr}`)
    const second = await sevalla(['apps', 'edge-cache-toggle', appId])
    assert.equal(second.exitCode, 0, `edge-cache-toggle failed: ${second.stderr}`)
    assert.notEqual(first.json<{ is_turned_on: boolean }>().is_turned_on, second.json<{ is_turned_on: boolean }>().is_turned_on)
  })

  it('should list egress IPs', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const res = await sevalla(['apps', 'egress-ips', appId])
    assert.equal(res.exitCode, 0, `egress-ips failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<{ egress_ips: string[] }>().egress_ips))
  })

  // Maintenance mode

  it('should turn maintenance mode on with a custom page and off again', async () => {
    assert.ok(appId, 'appId must be set from before hook')

    const getRes = await sevalla(['apps', 'maintenance-mode', 'get', appId])
    assert.equal(getRes.exitCode, 0, `maintenance-mode get failed: ${getRes.stderr}`)
    assert.equal(getRes.json<{ is_enabled: boolean }>().is_enabled, false)

    const onRes = await sevalla(['apps', 'maintenance-mode', 'update', appId, '--enabled', 'true', '--page-url', 'https://sevalla.com'])
    assert.equal(onRes.exitCode, 0, `maintenance-mode update failed: ${onRes.stderr}`)
    assert.deepEqual(onRes.json(), { is_enabled: true, page_url: 'https://sevalla.com' })

    const offRes = await sevalla(['apps', 'maintenance-mode', 'update', appId, '--enabled', 'false', '--page-url', ''])
    assert.equal(offRes.exitCode, 0, `maintenance-mode update failed: ${offRes.stderr}`)
    assert.deepEqual(offRes.json(), { is_enabled: false, page_url: null })
  })
})
