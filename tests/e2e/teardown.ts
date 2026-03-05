import { sevalla } from './helpers/cli.ts'
import { safeDeleteApp, safeDelete } from './helpers/cleanup.ts'

const E2E_PREFIX = 'e2e-'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type ListItem = { id: string; display_name?: string; name?: string }

async function cancelStaticSiteDeployments(siteId: string) {
  const nonTerminal = ['queued', 'pending', 'building', 'built', 'deploying', 'rolling_out', 'in_progress']
  const res = await sevalla(['static-sites', 'deployments', 'list', '--site-id', siteId])
  if (res.exitCode !== 0) return
  const deps = res.json<{ id: string; status?: string | null }[]>()
  for (const dep of deps) {
    if (dep.status && nonTerminal.includes(dep.status)) {
      await sevalla(['static-sites', 'deployments', 'cancel', dep.id, '--site-id', siteId])
    }
  }
}

async function safeDeleteStaticSite(siteId: string) {
  await cancelStaticSiteDeployments(siteId)
  for (let attempt = 0; attempt < 15; attempt++) {
    const res = await sevalla(['static-sites', 'delete', siteId, '--confirm'])
    if (res.exitCode === 0) return
    await cancelStaticSiteDeployments(siteId)
    await sleep(3000)
  }
}

async function waitForDbTerminal(dbId: string) {
  const terminal = ['ready', 'suspended', 'error']
  for (let i = 0; i < 60; i++) {
    const res = await sevalla(['databases', 'get', dbId])
    if (res.exitCode === 0) {
      const data = res.json<{ status?: string }>()
      if (data.status && terminal.includes(data.status)) return
    }
    await sleep(3000)
  }
}

async function cleanupResource(cliCommand: string[], opts?: { cancelDeployments?: boolean; staticSite?: boolean; waitForDb?: boolean }) {
  const res = await sevalla([...cliCommand, 'list', '--per-page', '100'])
  if (res.exitCode !== 0) return

  let items: ListItem[]
  try {
    items = res.json<ListItem[]>()
  } catch {
    return
  }

  const e2eItems = items.filter((item) => {
    const label = item.display_name ?? item.name ?? ''
    return label.startsWith(E2E_PREFIX)
  })

  if (e2eItems.length === 0) return

  console.log(`[teardown] Cleaning up ${e2eItems.length} ${cliCommand.join(' ')} resources...`)

  for (const item of e2eItems) {
    try {
      if (opts?.cancelDeployments) {
        await safeDeleteApp(item.id)
      } else if (opts?.staticSite) {
        await safeDeleteStaticSite(item.id)
      } else if (opts?.waitForDb) {
        await waitForDbTerminal(item.id).catch(() => {})
        await safeDelete(cliCommand, item.id)
      } else {
        await safeDelete(cliCommand, item.id)
      }
    } catch (err) {
      console.error(`[teardown] Failed to delete ${cliCommand.join(' ')} ${item.id}:`, err)
    }
  }
}

async function main() {
  console.log('[teardown] Starting global e2e cleanup...')

  // Delete services first (they depend on projects)
  await cleanupResource(['apps'], { cancelDeployments: true })
  await cleanupResource(['static-sites'], { staticSite: true })
  await cleanupResource(['databases'], { waitForDb: true })
  await cleanupResource(['load-balancers'])
  await cleanupResource(['object-storage'])
  await cleanupResource(['pipelines'])
  await cleanupResource(['docker-registries'])
  await cleanupResource(['webhooks'])
  await cleanupResource(['api-keys'])
  // Projects last (other resources may reference them)
  await cleanupResource(['projects'])

  console.log('[teardown] Global e2e cleanup complete.')
}

main().catch((err) => {
  console.error('[teardown] Error:', err)
  process.exit(1)
})
