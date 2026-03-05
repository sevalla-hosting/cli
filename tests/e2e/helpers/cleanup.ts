import { sevalla } from './cli.ts'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function cancelAppDeployments(id: string): Promise<void> {
  const nonTerminal = ['queued', 'pending', 'building', 'built', 'deploying', 'rolling_out', 'in_progress']
  const deploymentsRes = await sevalla(['apps', 'deployments', 'list', '--app-id', id])
  if (deploymentsRes.exitCode !== 0) return
  try {
    const deployments = deploymentsRes.json<{ id: string; status: string | null }[]>()
    const active = deployments.filter((d) => d.status && nonTerminal.includes(d.status))
    for (const d of active) {
      await sevalla(['apps', 'deployments', 'cancel', d.id, '--app-id', id])
    }
  } catch {
    // best effort
  }
}

export async function safeDeleteApp(id: string): Promise<void> {
  await cancelAppDeployments(id)
  for (let attempt = 0; attempt < 20; attempt++) {
    const res = await sevalla(['apps', 'delete', id, '--confirm'])
    if (res.exitCode === 0) return
    await cancelAppDeployments(id)
    await sleep(3000)
  }
}

export async function safeDelete(command: string[], id: string): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await sevalla([...command, 'delete', id, '--confirm'])
    if (res.exitCode === 0) return
    await sleep(2000)
  }
}
