import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { sevalla, refusedOnStateOnly } from '../helpers/cli.ts'
import { safeDelete } from '../helpers/cleanup.ts'

const RESOURCE = 'static-sites'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function cancelActiveDeployments(siteId: string) {
  const nonTerminal = ['waiting', 'inProgress']
  for (let attempt = 0; attempt < 10; attempt++) {
    const res = await sevalla([RESOURCE, 'deployments', 'list', '--site-id', siteId])
    if (res.exitCode !== 0) return
    const deps = res.json<{ id: string; status?: string | null }[]>()
    const active = deps.filter((d) => d.status && nonTerminal.includes(d.status))
    if (active.length === 0) return
    for (const dep of active) {
      await sevalla([RESOURCE, 'deployments', 'cancel', dep.id, '--site-id', siteId])
    }
    await sleep(3000)
  }
}

describe(RESOURCE, () => {
  let createdId: string | undefined
  let projectId: string
  let deploymentId: string | undefined
  let envVarId: string | undefined

  before(async () => {
    const projName = `e2e-ss-proj-${Date.now()}`
    const projRes = await sevalla(['projects', 'create', '--name', projName])
    assert.equal(projRes.exitCode, 0, `Failed to create project. stderr: ${projRes.stderr}`)
    projectId = projRes.json<{ id: string }>().id
  })

  after(async () => {
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
  it('should list static sites', async () => {
    const res = await sevalla([RESOURCE, 'list'])
    assert.equal(res.exitCode, 0, `list failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<unknown[]>()))
  })

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------
  it('should create a static site with git repo params', async () => {
    const name = `e2e-static-${Date.now()}`
    const res = await sevalla([
      RESOURCE, 'create',
      '--name', name,
      '--repository', 'https://github.com/kotapeter/pack-demo',
      '--branch', 'main',
      '--source', 'publicGit',
      '--project', projectId,
      '--build-command', 'npm run build',
      '--publish-directory', 'dist',
      '--node-version', '20',
    ], { timeout: 120_000 })
    assert.equal(res.exitCode, 0, `create failed: ${res.stderr}`)
    const created = res.json<{ id: string }>()
    assert.ok(created.id)
    createdId = created.id
  })

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------
  it('should get a static site by id', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([RESOURCE, 'get', createdId])
    assert.equal(res.exitCode, 0, `get failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  it('should return exit code 1 for non-existent static site', async () => {
    const res = await sevalla([RESOURCE, 'get', '00000000-0000-0000-0000-000000000000'])
    assert.equal(res.exitCode, 1)
  })

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  it('should update a static site display-name', async () => {
    assert.ok(createdId, 'No static site was created')
    const updatedName = `e2e-static-updated-${Date.now()}`
    const res = await sevalla([RESOURCE, 'update', createdId, '--display-name', updatedName])
    assert.equal(res.exitCode, 0, `update failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, createdId)
  })

  // ---------------------------------------------------------------------------
  // Domains
  // ---------------------------------------------------------------------------
  it('should list static site domains', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([RESOURCE, 'domains', 'list', '--site-id', createdId])
    assert.equal(res.exitCode, 0, `domains list failed: ${res.stderr}`)
    assert.ok(Array.isArray(res.json<unknown[]>()))
  })

  it('should add and delete a custom domain', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([RESOURCE, 'domains', 'add', createdId, '--name', `e2e-ss-${Date.now()}.sevalla.com`])
    assert.equal(res.exitCode, 0, `domains add failed: ${res.stderr}`)
    const domain = res.json<{ id: string }>()
    assert.ok(domain.id)

    const delRes = await sevalla([RESOURCE, 'domains', 'delete', createdId, domain.id, '--confirm'])
    assert.equal(delRes.exitCode, 0, `domains delete failed: ${delRes.stderr}`)
  })

  it('should rename the system domain', async () => {
    assert.ok(createdId, 'No static site was created')
    const listRes = await sevalla([RESOURCE, 'domains', 'list', '--site-id', createdId])
    assert.equal(listRes.exitCode, 0, `domains list failed: ${listRes.stderr}`)
    const system = listRes.json<{ id: string; type: string }[]>().find((d) => d.type === 'SYSTEM')
    assert.ok(system, 'static site should have a system domain')

    const res = await sevalla([
      RESOURCE, 'domains', 'update', system.id,
      '--site-id', createdId,
      '--name', `e2e-ss-${Date.now()}`,
    ])
    // System domain renames can be refused for environment reasons, so only the request shape is asserted
    assert.ok(refusedOnStateOnly(res), `domains update failed on request shape, auth or crash: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Deployments
  // ---------------------------------------------------------------------------
  it('should list static site deployments', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([RESOURCE, 'deployments', 'list', '--site-id', createdId])
    assert.equal(res.exitCode, 0, `deployments list failed: ${res.stderr}`)
    const deployments = res.json<{ id: string }[]>()
    assert.ok(Array.isArray(deployments))
    if (deployments.length > 0) {
      deploymentId = (deployments[0] as { id: string }).id
    }
  })

  it('should trigger a static site deployment', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([
      RESOURCE, 'deployments', 'trigger', createdId,
      '--branch', 'main',
    ], { timeout: 120_000 })
    assert.equal(res.exitCode, 0, `deployments trigger failed: ${res.stderr}`)
    const deployment = res.json<{ id: string }>()
    assert.ok(deployment.id)
    deploymentId = deployment.id
  })

  it('should get a static site deployment by id', async () => {
    assert.ok(createdId, 'No static site was created')
    assert.ok(deploymentId, 'No deployment was triggered')
    const res = await sevalla([RESOURCE, 'deployments', 'get', deploymentId, '--site-id', createdId])
    assert.equal(res.exitCode, 0, `deployments get failed: ${res.stderr}`)
    assert.equal(res.json<{ id: string }>().id, deploymentId)
  })

  // ---------------------------------------------------------------------------
  // Environment Variables
  // ---------------------------------------------------------------------------
  it('should create a static site env var', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([
      RESOURCE, 'env-vars', 'create', createdId,
      '--key', 'E2E_SS_VAR',
      '--value', 'test-value-123',
    ])
    assert.equal(res.exitCode, 0, `env-vars create failed: ${res.stderr}`)
    const envVar = res.json<{ id: string }>()
    assert.ok(envVar.id)
    envVarId = envVar.id
  })

  it('should list static site env vars', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([RESOURCE, 'env-vars', 'list', '--site-id', createdId])
    assert.equal(res.exitCode, 0, `env-vars list failed: ${res.stderr}`)
    const envVars = res.json<{ id: string }[]>()
    assert.ok(Array.isArray(envVars))
    assert.ok(envVars.length > 0, 'should have at least one env var')
    assert.ok(envVars.every((v) => !('value' in v)), 'values should be hidden by default')

    const shown = await sevalla([RESOURCE, 'env-vars', 'list', '--site-id', createdId, '--show-values'])
    assert.equal(shown.exitCode, 0, `env-vars list --show-values failed: ${shown.stderr}`)
    assert.ok(shown.json<{ value?: string }[]>().every((v) => typeof v.value === 'string'))
  })

  it('should update a static site env var', async () => {
    assert.ok(createdId, 'No static site was created')
    assert.ok(envVarId, 'No env var was created')
    const res = await sevalla([
      RESOURCE, 'env-vars', 'update', envVarId,
      '--site-id', createdId,
      '--value', 'updated-value-456',
    ])
    assert.equal(res.exitCode, 0, `env-vars update failed: ${res.stderr}`)
    assert.ok(!res.stdout.includes('updated-value-456'), 'update should not echo the value')
  })

  it('should delete a static site env var', async () => {
    assert.ok(createdId, 'No static site was created')
    assert.ok(envVarId, 'No env var was created')
    const res = await sevalla([
      RESOURCE, 'env-vars', 'delete', createdId, envVarId,
      '--confirm',
    ])
    assert.equal(res.exitCode, 0, `env-vars delete failed: ${res.stderr}`)
    envVarId = undefined
  })

  // ---------------------------------------------------------------------------
  // Access Logs
  // ---------------------------------------------------------------------------
  it('should get static site access logs', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([RESOURCE, 'logs', 'access', createdId])
    assert.equal(res.exitCode, 0, `logs access failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Purge Cache
  // ---------------------------------------------------------------------------
  it('should purge static site cache', async () => {
    assert.ok(createdId, 'No static site was created')
    const res = await sevalla([RESOURCE, 'purge-cache', createdId])
    assert.equal(res.exitCode, 0, `purge-cache failed: ${res.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Logs filters and response time percentile
  // ---------------------------------------------------------------------------
  it('should get access logs with filters and a response time percentile', async () => {
    assert.ok(createdId, 'No static site was created')
    const logsRes = await sevalla([RESOURCE, 'logs', 'access', createdId, '--search', 'GET', '--order', 'desc', '--limit', '5'])
    assert.equal(logsRes.exitCode, 0, `logs access with filters failed: ${logsRes.stderr}`)
    const metricsRes = await sevalla([RESOURCE, 'metrics', 'response-time', createdId, '--percent', '95'])
    assert.equal(metricsRes.exitCode, 0, `metrics response-time --percent failed: ${metricsRes.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Repository
  // ---------------------------------------------------------------------------
  it('should browse the static site repository', async () => {
    assert.ok(createdId, 'No static site was created')
    const getRes = await sevalla([RESOURCE, 'repository', 'get', createdId])
    assert.equal(getRes.exitCode, 0, `repository get failed: ${getRes.stderr}`)
    assert.equal(getRes.json<{ source: string }>().source, 'publicGit')

    const treeRes = await sevalla([RESOURCE, 'repository', 'tree', createdId, '--ref', 'main', '--recursive'])
    assert.equal(treeRes.exitCode, 0, `repository tree failed: ${treeRes.stderr}`)
    const file = treeRes.json<{ entries: { path: string; type: string }[] }>().entries.find((e) => e.type === 'file')
    assert.ok(file, 'repository should contain a file')

    const fileRes = await sevalla([RESOURCE, 'repository', 'contents', createdId, '--path', file.path, '--ref', 'main'])
    assert.equal(fileRes.exitCode, 0, `repository contents failed: ${fileRes.stderr}`)
    assert.equal(fileRes.json<{ path: string }>().path, file.path)

    // Provider code search can be unavailable for public repositories
    const searchRes = await sevalla([RESOURCE, 'repository', 'search', createdId, '--query', 'main'])
    assert.ok(refusedOnStateOnly(searchRes), `repository search failed on request shape, auth or crash: ${searchRes.stderr}`)
  })

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  it('should delete a static site with --confirm', async () => {
    assert.ok(createdId, 'No static site was created')
    // Cancel any active deployments first
    await cancelActiveDeployments(createdId)
    // Retry delete - deployments may take time to fully cancel
    for (let attempt = 0; attempt < 30; attempt++) {
      const res = await sevalla([RESOURCE, 'delete', createdId, '--confirm'], { timeout: 60_000 })
      if (res.exitCode === 0) {
        const data = res.json<{ deleted: boolean; id: string }>()
        assert.equal(data.deleted, true)
        assert.equal(data.id, createdId)
        createdId = undefined
        return
      }
      await sleep(3000)
    }
    assert.fail('Could not delete static site after retries')
  })
})
