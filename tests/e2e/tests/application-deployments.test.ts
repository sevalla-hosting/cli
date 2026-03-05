import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla } from '../helpers/cli.ts'
import { safeDeleteApp, safeDelete } from '../helpers/cleanup.ts'

interface Cluster {
  id: string
  [key: string]: unknown
}

interface Project {
  id: string
  [key: string]: unknown
}

interface App {
  id: string
  [key: string]: unknown
}

interface Deployment {
  id: string
  status?: string | null
  [key: string]: unknown
}

interface Process {
  id: string
  [key: string]: unknown
}

describe('application deployments and processes', () => {
  const ts = Date.now()
  let clusterId: string
  let createdProjectId: string | undefined
  let createdAppId: string | undefined

  before(async () => {
    // Get a cluster ID
    const clustersRes = await sevalla(['resources', 'clusters'])
    assert.equal(clustersRes.exitCode, 0, `resources clusters failed: ${clustersRes.stderr}`)
    const clusters = clustersRes.json<Cluster[]>()
    assert.ok(Array.isArray(clusters), 'clusters response should be an array')
    assert.ok(clusters.length > 0, 'at least one cluster must exist')
    clusterId = (clusters[0] as Cluster).id

    // Create a project for the test app
    const projName = `e2e-deploy-proj-${ts}`
    const projRes = await sevalla(['projects', 'create', '--name', projName])
    assert.equal(projRes.exitCode, 0, `Failed to create project. stderr: ${projRes.stderr}`)
    const proj = projRes.json<Project>()
    createdProjectId = proj.id

    // Create an application from publicGit source
    const appName = `e2e-deploy-app-${ts}`
    const appRes = await sevalla([
      'apps', 'create',
      '--name', appName,
      '--project', createdProjectId,
      '--cluster', clusterId,
      '--source', 'publicGit',
      '--repository', 'https://github.com/kotapeter/pack-demo',
      '--branch', 'main',
    ], { timeout: 120_000 })
    assert.equal(appRes.exitCode, 0, `apps create failed: ${appRes.stderr}`)
    const app = appRes.json<App>()
    assert.ok(app.id, 'created app should have an id')
    createdAppId = app.id
  })

  after(async () => {
    if (createdAppId) {
      await safeDeleteApp(createdAppId)
    }
    if (createdProjectId) {
      await safeDelete(['projects'], createdProjectId)
    }
  })

  // --- Deployments ---

  it('should list deployments', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla(['apps', 'deployments', 'list', '--app-id', createdAppId])
    assert.equal(res.exitCode, 0, `apps deployments list failed: ${res.stderr}`)
    const deployments = res.json<Deployment[]>()
    assert.ok(Array.isArray(deployments), 'response should be an array')
  })

  it('should trigger a deployment', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla([
      'apps', 'deployments', 'trigger', createdAppId,
      '--branch', 'main',
    ], { timeout: 120_000 })
    assert.equal(res.exitCode, 0, `apps deployments trigger failed: ${res.stderr}`)
    const deployment = res.json<Deployment>()
    assert.ok(deployment.id, 'triggered deployment should have an id')
  })

  it('should get a deployment by ID', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    // List deployments and pick the first one
    const listRes = await sevalla(['apps', 'deployments', 'list', '--app-id', createdAppId])
    assert.equal(listRes.exitCode, 0, `apps deployments list failed: ${listRes.stderr}`)
    const deployments = listRes.json<Deployment[]>()
    assert.ok(deployments.length > 0, 'at least one deployment should exist')

    const deploymentId = (deployments[0] as Deployment).id
    const res = await sevalla(['apps', 'deployments', 'get', deploymentId, '--app-id', createdAppId])
    assert.equal(res.exitCode, 0, `apps deployments get failed: ${res.stderr}`)
    const deployment = res.json<Deployment>()
    assert.equal(deployment.id, deploymentId, 'returned deployment id should match')
  })

  it('should cancel a deployment', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    // Trigger a new deployment to cancel
    const triggerRes = await sevalla([
      'apps', 'deployments', 'trigger', createdAppId,
      '--branch', 'main',
    ], { timeout: 120_000 })
    assert.equal(triggerRes.exitCode, 0, `apps deployments trigger failed: ${triggerRes.stderr}`)
    const triggered = triggerRes.json<Deployment>()
    assert.ok(triggered.id, 'triggered deployment should have an id')

    const res = await sevalla([
      'apps', 'deployments', 'cancel', triggered.id,
      '--app-id', createdAppId,
    ], { timeout: 120_000 })
    assert.equal(res.exitCode, 0, `apps deployments cancel failed: ${res.stderr}`)
  })

  // --- Processes ---

  it('should list processes', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla(['apps', 'processes', 'list', '--app-id', createdAppId])
    assert.equal(res.exitCode, 0, `apps processes list failed: ${res.stderr}`)
    const processes = res.json<Process[]>()
    assert.ok(Array.isArray(processes), 'response should be an array')
  })

  it('should get a process by ID', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    // List processes and pick the first one if any exist
    const listRes = await sevalla(['apps', 'processes', 'list', '--app-id', createdAppId])
    assert.equal(listRes.exitCode, 0, `apps processes list failed: ${listRes.stderr}`)
    const processes = listRes.json<Process[]>()

    if (processes.length === 0) {
      return
    }

    const processId = (processes[0] as Process).id
    const res = await sevalla(['apps', 'processes', 'get', processId, '--app-id', createdAppId])
    assert.equal(res.exitCode, 0, `apps processes get failed: ${res.stderr}`)
    const proc = res.json<Process>()
    assert.equal(proc.id, processId, 'returned process id should match')
  })
})
