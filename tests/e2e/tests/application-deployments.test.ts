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

  it('should dry-run a deployment cancel without calling the API', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla(['apps', 'deployments', 'cancel', 'some-deployment', '--app-id', createdAppId, '--dry-run'])
    assert.equal(res.exitCode, 0, `cancel --dry-run failed: ${res.stderr}`)
    const body = res.json<{ dry_run: boolean; path: string }>()
    assert.equal(body.dry_run, true)
    assert.equal(body.path, `/applications/${createdAppId}/deployments/some-deployment/cancel`)
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

  it('should send skip-build-cache and restart triggers the API accepts', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    // A restart needs an earlier successful build, so the API may refuse on state, but never on request shape
    for (const flag of ['--skip-build-cache', '--restart']) {
      const res = await sevalla(['apps', 'deployments', 'trigger', createdAppId, flag], { timeout: 120_000 })
      assert.ok(refusedOnStateOnly(res), `trigger ${flag} failed on request shape, auth or crash: ${res.stderr}`)
    }
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

  it('should dry-run a process update without calling the API', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(workerProcessId, 'workerProcessId must be set from create test')

    const res = await sevalla([
      'apps', 'processes', 'update', workerProcessId, '--app-id', createdAppId, '--instances', '3', '--dry-run',
    ])
    assert.equal(res.exitCode, 0, `apps processes update --dry-run failed: ${res.stderr}`)
    const body = res.json<{ dry_run: boolean; method: string; body: Record<string, unknown> }>()
    assert.equal(body.dry_run, true)
    assert.equal(body.method, 'PATCH')
    assert.deepEqual(body.body, { scaling_strategy: { type: 'manual', config: { instanceCount: 3 } } })
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

  // --- Ingot builds ---

  it('should build new Git applications with ingot by default', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla(['apps', 'get', createdAppId])
    assert.equal(res.exitCode, 0, `apps get failed: ${res.stderr}`)
    assert.equal(res.json<{ build_type: string }>().build_type, 'ingot')
  })

  it('should warn that nixpacks is deprecated and switch back to ingot', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const nixRes = await sevalla(['apps', 'update', createdAppId, '--build-type', 'nixpacks'])
    assert.equal(nixRes.exitCode, 0, `apps update failed: ${nixRes.stderr}`)
    assert.match(nixRes.stderr, /nixpacks is deprecated/)

    const res = await sevalla(['apps', 'update', createdAppId, '--build-type', 'ingot'])
    assert.equal(res.exitCode, 0, `apps update failed: ${res.stderr}`)
    assert.equal(res.stderr, '')
    assert.equal(res.json<{ build_type: string }>().build_type, 'ingot')
  })

  it('should list the Dockerfiles and show which one a deployment used', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla(['apps', 'dockerfiles', 'list', '--app-id', createdAppId])
    assert.equal(res.exitCode, 0, `apps dockerfiles list failed: ${res.stderr}`)
    const dockerfiles = res.json<{ id: string }[]>()
    assert.ok(Array.isArray(dockerfiles), 'response should be an array')

    const deployRes = await sevalla(['apps', 'deployments', 'list', '--app-id', createdAppId])
    const [deployment] = deployRes.json<Deployment[]>()
    assert.ok(deployment, 'at least one deployment should exist')
    const getRes = await sevalla(['apps', 'deployments', 'get', deployment.id, '--app-id', createdAppId])
    assert.ok('dockerfile_id' in getRes.json<Record<string, unknown>>(), 'deployment should have dockerfile_id')

    // Builds that haven't finished have no Dockerfile yet
    const [dockerfile] = dockerfiles
    if (dockerfile) {
      const fileRes = await sevalla(['apps', 'dockerfiles', 'get', dockerfile.id, '--app-id', createdAppId])
      assert.equal(fileRes.exitCode, 0, `apps dockerfiles get failed: ${fileRes.stderr}`)
      assert.equal(typeof fileRes.json<{ dockerfile: string }>().dockerfile, 'string')
    }
  })

  it('should get deployment logs with filters', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const listRes = await sevalla(['apps', 'deployments', 'list', '--app-id', createdAppId])
    const [deployment] = listRes.json<Deployment[]>()
    assert.ok(deployment, 'at least one deployment should exist')
    const res = await sevalla([
      'apps', 'deployments', 'logs', deployment.id, '--app-id', createdAppId,
      '--search', 'build', '--order', 'desc', '--limit', '10',
    ])
    assert.equal(res.exitCode, 0, `apps deployments logs failed: ${res.stderr}`)
  })

  // --- Repository ---

  it('should browse the application repository', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const getRes = await sevalla(['apps', 'repository', 'get', createdAppId])
    assert.equal(getRes.exitCode, 0, `apps repository get failed: ${getRes.stderr}`)
    assert.equal(getRes.json<{ source: string }>().source, 'publicGit')

    const treeRes = await sevalla(['apps', 'repository', 'tree', createdAppId, '--ref', 'main'])
    assert.equal(treeRes.exitCode, 0, `apps repository tree failed: ${treeRes.stderr}`)
    const file = treeRes.json<{ entries: { path: string; type: string }[] }>().entries.find((e) => e.type === 'file')
    assert.ok(file, 'repository root should contain a file')

    const fileRes = await sevalla(['apps', 'repository', 'contents', createdAppId, '--path', file.path, '--ref', 'main'])
    assert.equal(fileRes.exitCode, 0, `apps repository contents failed: ${fileRes.stderr}`)
    assert.equal(fileRes.json<{ path: string }>().path, file.path)

    // Provider code search can be unavailable for public repositories
    const searchRes = await sevalla(['apps', 'repository', 'search', createdAppId, '--query', 'main'])
    assert.ok(refusedOnStateOnly(searchRes), `apps repository search failed on request shape, auth or crash: ${searchRes.stderr}`)
  })

  // --- Cron processes ---

  it('should create, update and list the runs of a cron process', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const typesRes = await sevalla(['resources', 'process-types'])
    const [resourceType] = typesRes.json<{ id: string }[]>()
    assert.ok(resourceType, 'at least one process resource type must exist')

    const createRes = await sevalla([
      'apps', 'processes', 'create', createdAppId,
      '--name', `e2e-cron-${ts}`,
      '--type', 'cron',
      '--resource-type', resourceType.id,
      '--command', 'echo hello',
      '--schedule', '0 3 * * *',
      '--concurrency-policy', 'Replace',
      '--max-run-time', '600',
    ])
    assert.equal(createRes.exitCode, 0, `apps processes create failed: ${createRes.stderr}`)
    const cronId = createRes.json<Process>().id

    try {
      const getRes = await sevalla(['apps', 'processes', 'get', cronId, '--app-id', createdAppId])
      const cron = getRes.json<{ concurrency_policy: string; active_deadline_seconds: number | null }>()
      assert.equal(cron.concurrency_policy, 'Replace')
      assert.equal(cron.active_deadline_seconds, 600)

      const updateRes = await sevalla([
        'apps', 'processes', 'update', cronId, '--app-id', createdAppId,
        '--schedule', '0 4 * * *', '--concurrency-policy', 'Forbid', '--max-run-time', '0',
      ])
      assert.equal(updateRes.exitCode, 0, `apps processes update failed: ${updateRes.stderr}`)

      const runsRes = await sevalla(['apps', 'processes', 'runs', '--app-id', createdAppId, '--process-id', cronId])
      assert.equal(runsRes.exitCode, 0, `apps processes runs failed: ${runsRes.stderr}`)
      assert.ok(Array.isArray(runsRes.json()), 'runs should be an array')
    } finally {
      let res = await sevalla(['apps', 'processes', 'delete', cronId, '--app-id', createdAppId, '--confirm'])
      for (let attempt = 0; attempt < 10 && res.exitCode !== 0; attempt++) {
        await cancelAppDeployments(createdAppId)
        await new Promise((resolve) => setTimeout(resolve, 3000))
        res = await sevalla(['apps', 'processes', 'delete', cronId, '--app-id', createdAppId, '--confirm'])
      }
    }
  })

  // --- Exec and terminal ---

  it('should send an exec request the API accepts', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const listRes = await sevalla(['apps', 'processes', 'list', '--app-id', createdAppId])
    const [web] = listRes.json<Process[]>()
    assert.ok(web, 'the app should have a process')

    // Nothing is running, so the API refuses on state, but never on request shape
    const res = await sevalla(['apps', 'processes', 'exec', web.id, '--app-id', createdAppId, '--timeout', '5', 'ls', '/'])
    if (res.exitCode === 0 || !res.stderr) {
      assert.equal(typeof res.json<{ exit_code: number }>().exit_code, 'number')
    } else {
      assert.ok(refusedOnStateOnly(res), `apps processes exec failed on request shape, auth or crash: ${res.stderr}`)
    }
  })

  it('should refuse to open a terminal without an interactive shell', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla(['apps', 'processes', 'terminal', '00000000-0000-0000-0000-000000000000', '--app-id', createdAppId])
    assert.equal(res.exitCode, 1)
    assert.match(res.stderr, /interactive shell/)
  })
})
