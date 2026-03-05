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

interface EnvVar {
  id: string
  key?: string
  value?: string
  [key: string]: unknown
}

describe('application environment variables', () => {
  const ts = Date.now()
  let clusterId: string | undefined
  let projectId: string | undefined
  let createdAppId: string | undefined
  let createdProjectId: string | undefined
  let createdEnvVarId: string | undefined

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
        `e2e-env-vars-project-${ts}`,
      ])
      assert.equal(createProjectRes.exitCode, 0, `projects create failed: ${createProjectRes.stderr}`)
      const project = createProjectRes.json<Project>()
      projectId = project.id
      createdProjectId = project.id
    }

    // Create an application from docker image
    const appName = `e2e-env-vars-app-${ts}`
    const appRes = await sevalla([
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

  it('should create an environment variable', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')

    const res = await sevalla([
      'apps',
      'env-vars',
      'create',
      createdAppId,
      '--key',
      'E2E_TEST_VAR',
      '--value',
      'test-value-123',
    ])
    assert.equal(res.exitCode, 0, `env-vars create failed: ${res.stderr}`)

    const envVar = res.json<EnvVar>()
    assert.ok(envVar.id, 'created env var should have an id')
    createdEnvVarId = envVar.id
  })

  it('should list environment variables', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(createdEnvVarId, 'createdEnvVarId must be set from create test')

    const res = await sevalla(['apps', 'env-vars', 'list', '--app-id', createdAppId])
    assert.equal(res.exitCode, 0, `env-vars list failed: ${res.stderr}`)

    const envVars = res.json<EnvVar[]>()
    assert.ok(Array.isArray(envVars), 'response should be an array')

    const found = envVars.find((v) => v.id === createdEnvVarId)
    assert.ok(found, 'created env var should appear in the list')
  })

  it('should update an environment variable', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(createdEnvVarId, 'createdEnvVarId must be set from create test')

    const res = await sevalla([
      'apps',
      'env-vars',
      'update',
      createdEnvVarId,
      '--app-id',
      createdAppId,
      '--value',
      'updated-value-456',
    ])
    assert.equal(res.exitCode, 0, `env-vars update failed: ${res.stderr}`)
  })

  it('should delete an environment variable', async () => {
    assert.ok(createdAppId, 'createdAppId must be set from before hook')
    assert.ok(createdEnvVarId, 'createdEnvVarId must be set from create test')

    const res = await sevalla([
      'apps',
      'env-vars',
      'delete',
      createdAppId,
      createdEnvVarId,
      '--confirm',
    ])
    assert.equal(res.exitCode, 0, `env-vars delete failed: ${res.stderr}`)

    // Clear so we know the env var was cleaned up
    createdEnvVarId = undefined
  })
})
