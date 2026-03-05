# Sevalla CLI — Agent Guide

Machine-readable reference for AI agents using the Sevalla CLI.

## Authentication

Set `SEVALLA_API_TOKEN` as an environment variable. Do **not** use `sevalla login` (requires a browser).

```bash
export SEVALLA_API_TOKEN="your-api-token"
sevalla auth status --json
# → { "logged_in": true, "source": "environment" }
```

## Output Format

| Context | Default output |
|---------|---------------|
| Terminal (TTY) | Human-readable table |
| Piped / non-TTY | JSON (auto-detected) |
| Any + `--json` | JSON (explicit) |

Always parse JSON output. Never parse table output.

## Command Discovery

```bash
sevalla schema              # Full command tree as JSON
sevalla schema apps.create  # Single command metadata
```

The schema includes arguments, options, descriptions, and defaults.

## Dry Run

Mutation commands (`create`, `update`, `delete`, action commands) support `--dry-run`:

```bash
sevalla apps create --name test --project p1 --cluster c1 --dry-run
# → { "dry_run": true, "command": "create", "options": { ... } }
```

No API call is made. Use this to validate inputs before executing.

## Raw JSON Body

Commands with `--data` accept a raw JSON payload, bypassing flag-based input:

```bash
sevalla apps create --data '{"name":"test","project_id":"p1","cluster_id":"c1"}'
```

Combine with `--dry-run` to preview:

```bash
sevalla apps create --data '{"name":"test"}' --dry-run
```

## Destructive Operations

All destructive commands require `--confirm`:

```bash
sevalla apps delete <id> --confirm
```

## Error Format

Errors are output as JSON when in JSON mode:

```json
{
  "error": true,
  "status": 404,
  "message": "Not Found"
}
```

## Input Validation

IDs are validated before API calls. The following are rejected:
- Empty values
- Control characters
- Path traversal (`../`)
- Suspicious characters (`?`, `#`, `%`, whitespace, `/`, `\`)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SEVALLA_API_TOKEN` | API token for headless auth (takes precedence over credentials file) |
| `SEVALLA_API_URL` | Override API base URL |

## Best Practices for Agents

1. Authenticate with `SEVALLA_API_TOKEN`, not `sevalla login`
2. Use `sevalla schema` to discover commands programmatically
3. Parse JSON output (auto-enabled when piped)
4. Use `--dry-run` to validate before mutating
5. Use `--data` for raw payloads when you have the exact API body
6. Always pass `--confirm` for destructive operations
7. Use `--json` explicitly if you want to guarantee JSON output
