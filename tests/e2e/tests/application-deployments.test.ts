import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla, refusedOnStateOnly } from '../helpers/cli.ts'
import { safeDeleteApp, safeDelete, cancelAppDeployments } from '../helpers/cleanup.ts'

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
  let workerProcessId: string | undefined

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

  it('should send a rollback request the API accepts', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    // No deployment has succeeded yet, so the API may refuse on state, but never on request shape
    const res = await sevalla(['apps', 'deployments', 'rollback', createdAppId], { timeout: 120_000 })
    assert.ok(refusedOnStateOnly(res), `apps deployments rollback failed on request shape, auth or crash: ${res.stderr}`)
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

  it('should attach, grow and detach a disk on the web process', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const listRes = await sevalla(['apps', 'processes', 'list', '--app-id', createdAppId])
    assert.equal(listRes.exitCode, 0, `apps processes list failed: ${listRes.stderr}`)
    const web = listRes.json<Process[]>().find((proc) => proc['type'] === 'web')
    assert.ok(web, 'the app should have a web process')

    const typesRes = await sevalla(['resources', 'disk-types'])
    assert.equal(typesRes.exitCode, 0, `resources disk-types failed: ${typesRes.stderr}`)
    const [smallest, larger] = typesRes.json<{ id: string; size_gib: number }[]>().sort((a, b) => a.size_gib - b.size_gib)
    assert.ok(smallest, 'at least one disk resource type must exist')

    const attachRes = await sevalla([
      'apps', 'processes', 'disk', 'update', web.id,
      '--app-id', createdAppId,
      '--resource-type', smallest.id,
      '--mount-path', '/var/lib/data',
    ])
    assert.equal(attachRes.exitCode, 0, `apps processes disk update failed: ${attachRes.stderr}`)
    assert.equal(attachRes.json<{ size_gib: number }>().size_gib, smallest.size_gib)

    if (larger) {
      const growRes = await sevalla([
        'apps', 'processes', 'disk', 'update', web.id,
        '--app-id', createdAppId,
        '--resource-type', larger.id,
        '--mount-path', '/var/lib/data',
      ])
      assert.equal(growRes.exitCode, 0, `growing the disk failed: ${growRes.stderr}`)
      assert.equal(growRes.json<{ size_gib: number }>().size_gib, larger.size_gib)
    }

    const getRes = await sevalla(['apps', 'processes', 'get', web.id, '--app-id', createdAppId])
    assert.equal(getRes.exitCode, 0, `apps processes get failed: ${getRes.stderr}`)
    assert.equal(getRes.json<{ disk: { mount_path: string } | null }>().disk?.mount_path, '/var/lib/data')

    const detachRes = await sevalla(['apps', 'processes', 'disk', 'delete', web.id, '--app-id', createdAppId, '--confirm'])
    assert.equal(detachRes.exitCode, 0, `apps processes disk delete failed: ${detachRes.stderr}`)
  })

  it('should create a worker process', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const typesRes = await sevalla(['resources', 'process-types'])
    assert.equal(typesRes.exitCode, 0, `resources process-types failed: ${typesRes.stderr}`)
    const types = typesRes.json<{ id: string }[]>()
    assert.ok(types.length > 0, 'at least one process resource type must exist')

    const res = await sevalla([
      'apps', 'processes', 'create', createdAppId,
      '--name', `e2e-worker-${ts}`,
      '--type', 'worker',
      '--resource-type', (types[0] as { id: string }).id,
      '--command', 'sleep infinity',
    ])
    assert.equal(res.exitCode, 0, `apps processes create failed: ${res.stderr}`)
    const proc = res.json<Process>()
    assert.ok(proc.id, 'created process should have an id')
    workerProcessId = proc.id
  })

  it('should update a process', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(workerProcessId, 'workerProcessId must be set from create test')

    const res = await sevalla([
      'apps', 'processes', 'update', workerProcessId,
      '--app-id', createdAppId,
      '--name', `e2e-worker-updated-${ts}`,
      '--command', 'sleep 3600',
      '--instances', '2',
    ])
    assert.equal(res.exitCode, 0, `apps processes update failed: ${res.stderr}`)
  })

  it('should get process metrics', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(workerProcessId, 'workerProcessId must be set from create test')

    for (const metric of ['cpu-usage', 'cpu-limit', 'memory-usage', 'memory-limit', 'instance-count']) {
      const res = await sevalla(['apps', 'processes', 'metrics', metric, createdAppId, workerProcessId])
      assert.equal(res.exitCode, 0, `apps processes metrics ${metric} failed: ${res.stderr}`)
      assert.ok(Array.isArray(res.json()), `${metric} should return an array`)
    }
  })

  it('should create and delete a TCP proxy', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(workerProcessId, 'workerProcessId must be set from create test')

    const res = await sevalla([
      'apps', 'tcp-proxies', 'create', createdAppId,
      '--process-id', workerProcessId,
      '--port', '6379',
    ])
    assert.equal(res.exitCode, 0, `apps tcp-proxies create failed: ${res.stderr}`)
    const proxy = res.json<{ id: string }>()
    assert.ok(proxy.id, 'created TCP proxy should have an id')

    const delRes = await sevalla(['apps', 'tcp-proxies', 'delete', createdAppId, proxy.id, '--confirm'])
    assert.equal(delRes.exitCode, 0, `apps tcp-proxies delete failed: ${delRes.stderr}`)
  })

  it('should create and delete a private port', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(workerProcessId, 'workerProcessId must be set from create test')

    const res = await sevalla([
      'apps', 'private-ports', 'create', createdAppId,
      '--process-id', workerProcessId,
      '--port', '8081',
    ])
    assert.equal(res.exitCode, 0, `apps private-ports create failed: ${res.stderr}`)
    const port = res.json<{ id: string }>()
    assert.ok(port.id, 'created private port should have an id')

    const delRes = await sevalla(['apps', 'private-ports', 'delete', createdAppId, port.id, '--confirm'])
    assert.equal(delRes.exitCode, 0, `apps private-ports delete failed: ${delRes.stderr}`)
  })

  it('should delete a process', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(workerProcessId, 'workerProcessId must be set from create test')

    // Process changes start a deployment, and the API refuses to delete while one is running
    let res = await sevalla(['apps', 'processes', 'delete', workerProcessId, '--app-id', createdAppId, '--confirm'])
    for (let attempt = 0; attempt < 10 && res.exitCode !== 0; attempt++) {
      await cancelAppDeployments(createdAppId)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      res = await sevalla(['apps', 'processes', 'delete', workerProcessId, '--app-id', createdAppId, '--confirm'])
    }
    assert.equal(res.exitCode, 0, `apps processes delete failed: ${res.stderr}`)
    workerProcessId = undefined
  })
})
