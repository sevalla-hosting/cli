# Sevalla CLI — Agent Guide

Machine-readable reference for AI agents using the Sevalla CLI.

## Authentication

Set `SEVALLA_API_TOKEN` as an environment variable. Do **not** use `sevalla login` (requires a browser).

```bash
export SEVALLA_API_TOKEN="your-api-token"
sevalla auth status --json
# → { "logged_in": true, "source": "environment" }
```

`auth status` checks the token with the API. A revoked or expired token gives `"logged_in": false, "token_rejected": true`.

## Output Format

| Context | Default output |
|---------|---------------|
| Terminal (TTY) | Human-readable table |
| Piped / non-TTY | JSON (auto-detected) |
| Any + `--json` | JSON (explicit) |

Always parse JSON output. Never parse table output.

List commands return one page (25 items by default, `--per-page` up to 100). When more pages exist, stderr says so, e.g. `Showing 1-25 of 60. Use --page 2 for the next page.` Check it before concluding that a resource doesn't exist.

## Command Discovery

```bash
sevalla schema              # Full command tree as JSON
sevalla schema apps.create  # Single command metadata
```

The schema includes arguments, options, descriptions, and defaults. For options, `mandatory: true` means the option must be passed; `takesValue: true` means it takes a value (`--name <name>`) rather than being a boolean switch.

## Dry Run

Most mutation commands (`create`, `update`, `delete`, action commands) support `--dry-run`; `sevalla schema <command>` lists it when they do. A command without it rejects the flag and does nothing:

```bash
sevalla apps create --name test --cluster c1 --source dockerImage --docker-image nginx:latest --dry-run
# → { "dry_run": true, "command": "create", "options": { ... } }
```

No API call is made. Use this to validate inputs before executing. Passwords, secrets and env var values are masked in the output.

## Raw JSON Body

Commands with `--data` accept a raw JSON payload instead of flag-based input. `--data` can't be combined with the body flags; put every field in the JSON:

```bash
sevalla apps create --data '{"display_name":"test","cluster_id":"c1","source":"dockerImage","docker_image":"nginx:latest"}'
```

Combine with `--dry-run` to preview:

```bash
sevalla apps create --data '{"display_name":"test"}' --dry-run
```

## Destructive Operations

The CLI never prompts. Commands that delete data or can't be undone fail unless `--confirm` is passed: every `delete`/`remove`, and `apps suspend`, `databases suspend`, `databases reset-password`, `databases backups restore`, `api-keys rotate`, `object-storage rotate-credentials`, `webhooks roll-secret`, `apps deployment-hook regenerate`.

```bash
sevalla apps delete <id> --confirm
```

`--dry-run` works without `--confirm`.

## Secrets

Environment variable values are hidden by default (`env-vars list` shows keys only; pass `--show-values` to include them), and `env-vars create`/`update` don't echo the value back.

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
