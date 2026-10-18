import { execFile } from 'node:child_process'

const CLI_PATH = new URL('../../../dist/index.js', import.meta.url).pathname
const API_KEY = process.env.API_KEY
if (!API_KEY) {
  throw new Error('API_KEY environment variable is required')
}

export type CliResult = {
  exitCode: number
  stdout: string
  stderr: string
  json: <T = unknown>() => T
}

export function sevalla(args: string[], opts?: { env?: Record<string, string>; timeout?: number }): Promise<CliResult> {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      SEVALLA_API_TOKEN: API_KEY,
      ...(opts?.env ?? {}),
    }

    execFile('node', [CLI_PATH, ...args, '--json'], { env, timeout: opts?.timeout ?? 30_000 }, (error, stdout, stderr) => {
      const exitCode = error && 'code' in error ? (error.code as number) : error ? 1 : 0
      resolve({
        exitCode,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
        json: <T = unknown>() => JSON.parse(stdout.toString()) as T,
      })
    })
  })
}

export function sevallaRaw(args: string[], opts?: { env?: Record<string, string>; timeout?: number }): Promise<CliResult> {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      SEVALLA_API_TOKEN: API_KEY,
      ...(opts?.env ?? {}),
    }

    execFile('node', [CLI_PATH, ...args], { env, timeout: opts?.timeout ?? 30_000 }, (error, stdout, stderr) => {
      const exitCode = error && 'code' in error ? (error.code as number) : error ? 1 : 0
      resolve({
        exitCode,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
        json: <T = unknown>() => JSON.parse(stdout.toString()) as T,
      })
    })
  })
}

// For state-dependent calls: success, or an API refusal that isn't auth or schema validation (crashes and timeouts fail)
export function refusedOnStateOnly(res: CliResult): boolean {
  if (res.exitCode === 0) return true
  try {
    const { error } = JSON.parse(res.stderr) as { error: { status?: number } }
    return typeof error.status === 'number' && ![401, 403].includes(error.status) && !res.stderr.includes("doesn't match the schema")
  } catch {
    return false
  }
}
