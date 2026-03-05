<div align="center">

# Sevalla CLI

**Manage your Sevalla infrastructure from the terminal.**

[![CI](https://github.com/sevalla-hosting/cli/actions/workflows/ci.yml/badge.svg)](https://github.com/sevalla-hosting/cli/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/npm/v/@sevalla/cli)](https://www.npmjs.com/package/@sevalla/cli)

</div>

---

The official CLI for the [Sevalla](https://sevalla.com) cloud platform. Deploy applications, manage databases, configure domains, monitor metrics, and more — all from your terminal. Every command supports `--json` output for CI/CD scripting.

## Installation

```bash
# Homebrew
brew install sevalla-hosting/tap/sevalla

# npm (requires Node.js 22+)
npm install -g @sevalla/cli

# Shell script
bash <(curl -fsSL https://raw.githubusercontent.com/sevalla-hosting/cli/main/install.sh)
```

Windows binaries are available on the [releases page](https://github.com/sevalla-hosting/cli/releases/latest).

## Quick Start

```bash
sevalla login
sevalla apps list
```

## Authentication

### Device Authorization (Interactive)

The recommended way to authenticate — opens your browser, no need to copy-paste tokens.

```bash
# Log in (opens browser for authorization)
sevalla login

# Check auth status
sevalla auth status

# Log out
sevalla logout
```

Credentials are stored at `~/.config/sevalla/credentials.json` with `0600` permissions.

### API Token (CI/CD & Scripting)

For non-interactive environments, set the `SEVALLA_API_TOKEN` environment variable. When set, it takes priority over stored credentials.

```bash
# Export for the current session
export SEVALLA_API_TOKEN="your-api-token"
sevalla apps list

# Or inline for a single command
SEVALLA_API_TOKEN="your-api-token" sevalla apps list
```

You can generate an API token from **Settings > API Keys** in the [Sevalla dashboard](https://sevalla.com), or via the CLI:

```bash
sevalla api-keys create --name "CI Token"
```

## Usage

### Applications

```bash
sevalla apps list
sevalla apps get <id>
sevalla apps create --name myapp --source privateGit --cluster <id>
sevalla apps update <id> --display-name "My App"
sevalla apps delete <id>
sevalla apps activate <id>
sevalla apps suspend <id>
sevalla apps clone <id> --display-name "Clone" --cluster <id>
sevalla apps purge-cache <id>
sevalla apps cdn-toggle <id>
```

### Deployments

```bash
sevalla apps deployments list --app-id <id>
sevalla apps deployments get <deployment-id> --app-id <id>
sevalla apps deployments trigger <app-id> --branch main
sevalla apps deployments rollback <app-id> --deployment-id <id>
sevalla apps deployments cancel <deployment-id> --app-id <id>
sevalla apps deployments logs <deployment-id> --app-id <id>
```

### Processes

```bash
sevalla apps processes list --app-id <id>
sevalla apps processes get <process-id> --app-id <id>
sevalla apps processes create <app-id> --name web --type web
sevalla apps processes update <process-id> --app-id <id> --instances 3
sevalla apps processes delete <process-id> --app-id <id>
sevalla apps processes trigger <process-id> --app-id <id>
```

### Process Metrics

```bash
sevalla apps processes metrics cpu-usage <app-id> <process-id>
sevalla apps processes metrics cpu-limit <app-id> <process-id>
sevalla apps processes metrics memory-usage <app-id> <process-id>
sevalla apps processes metrics memory-limit <app-id> <process-id>
sevalla apps processes metrics instance-count <app-id> <process-id>
```

### Application Domains

```bash
sevalla apps domains list --app-id <id>
sevalla apps domains add <app-id> --name example.com
sevalla apps domains get <domain-id> --app-id <id>
sevalla apps domains update <domain-id> --app-id <id>
sevalla apps domains delete <domain-id> --app-id <id>
sevalla apps domains set-primary <domain-id> --app-id <id>
sevalla apps domains toggle <domain-id> --app-id <id>
sevalla apps domains refresh-status <domain-id> --app-id <id>
```

### Application Environment Variables

```bash
sevalla apps env-vars list --app-id <id>
sevalla apps env-vars create <app-id> --key MY_VAR --value "my value"
sevalla apps env-vars update <env-var-id> --app-id <id> --value "new value"
sevalla apps env-vars delete <env-var-id> --app-id <id>
```

### Application Logs

```bash
sevalla apps logs runtime <app-id>
sevalla apps logs access <app-id>
```

### Application Metrics

```bash
sevalla apps metrics requests-per-minute <app-id>
sevalla apps metrics response-time <app-id>
sevalla apps metrics response-time-avg <app-id>
sevalla apps metrics status-codes <app-id>
sevalla apps metrics top-status-codes <app-id>
sevalla apps metrics top-countries <app-id>
sevalla apps metrics slowest-requests <app-id>
sevalla apps metrics top-pages <app-id>
```

### Application IP Restriction

```bash
sevalla apps ip-restriction get <app-id>
sevalla apps ip-restriction update <app-id> --type allow --ip-list "1.2.3.4,5.6.7.8"
```

### TCP Proxies

```bash
sevalla apps tcp-proxies list --app-id <id>
sevalla apps tcp-proxies create <app-id> --port 3000
sevalla apps tcp-proxies delete <tcp-proxy-id> --app-id <id>
```

### Private Ports

```bash
sevalla apps private-ports list --app-id <id>
sevalla apps private-ports create <app-id> --port 8080 --protocol TCP
sevalla apps private-ports delete <private-port-id> --app-id <id>
```

### Deployment Hook

```bash
sevalla apps deployment-hook get <app-id>
sevalla apps deployment-hook enable <app-id>
sevalla apps deployment-hook disable <app-id>
sevalla apps deployment-hook regenerate <app-id>
```

### Databases

```bash
sevalla databases list
sevalla databases get <id>
sevalla databases create --name mydb --type postgresql --db-version 16 \
  --cluster <id> --resource-type <id> --db-name mydb --db-password secret
sevalla databases update <id> --display-name "My DB"
sevalla databases delete <id>
sevalla databases activate <id>
sevalla databases suspend <id>
sevalla databases reset-password <id>
```

### Database Backups

```bash
sevalla databases backups list --db-id <id>
sevalla databases backups create <db-id>
sevalla databases backups delete <db-id> <backup-id>
sevalla databases backups restore <db-id> <backup-id>
```

### Database Connections

```bash
sevalla databases connections internal-list --db-id <id>
sevalla databases connections internal-create <db-id> --application-id <id>
sevalla databases connections internal-delete <db-id> <connection-id>
sevalla databases connections external-toggle <db-id>
```

### Database Metrics

```bash
sevalla databases metrics cpu-usage <id>
sevalla databases metrics cpu-limit <id>
sevalla databases metrics memory-usage <id>
sevalla databases metrics memory-limit <id>
sevalla databases metrics storage-usage <id>
sevalla databases metrics storage-limit <id>
sevalla databases metrics all-storage <id>
sevalla databases metrics used-storage <id>
```

### Database IP Restriction

```bash
sevalla databases ip-restriction get <db-id>
sevalla databases ip-restriction update <db-id>
```

### Static Sites

```bash
sevalla static-sites list
sevalla static-sites get <id>
sevalla static-sites create --name mysite --repository user/repo --branch main
sevalla static-sites update <id> --display-name "My Site"
sevalla static-sites delete <id>
sevalla static-sites purge-cache <id>
```

### Static Site Deployments

```bash
sevalla static-sites deployments list --site-id <id>
sevalla static-sites deployments get <deployment-id> --site-id <id>
sevalla static-sites deployments trigger <site-id> --branch main
sevalla static-sites deployments cancel <deployment-id> --site-id <id>
sevalla static-sites deployments logs <deployment-id> --site-id <id>
```

### Static Site Domains

```bash
sevalla static-sites domains list --site-id <id>
sevalla static-sites domains get <domain-id> --site-id <id>
sevalla static-sites domains add <site-id> --name example.com
sevalla static-sites domains update <domain-id> --site-id <id>
sevalla static-sites domains delete <site-id> <domain-id>
sevalla static-sites domains set-primary <site-id> <domain-id>
sevalla static-sites domains toggle <site-id> <domain-id>
sevalla static-sites domains refresh-status <site-id> <domain-id>
```

### Static Site Environment Variables

```bash
sevalla static-sites env-vars list --site-id <id>
sevalla static-sites env-vars create <site-id> --key MY_VAR --value "my value"
sevalla static-sites env-vars update <env-var-id> --site-id <id>
sevalla static-sites env-vars delete <site-id> <env-var-id>
```

### Static Site Logs

```bash
sevalla static-sites logs access <site-id>
```

### Static Site Metrics

```bash
sevalla static-sites metrics requests-per-minute <site-id>
sevalla static-sites metrics response-time <site-id>
sevalla static-sites metrics response-time-avg <site-id>
sevalla static-sites metrics status-codes <site-id>
sevalla static-sites metrics top-status-codes <site-id>
sevalla static-sites metrics top-countries <site-id>
sevalla static-sites metrics slowest-requests <site-id>
sevalla static-sites metrics top-pages <site-id>
```

### Load Balancers

```bash
sevalla load-balancers list
sevalla load-balancers get <id>
sevalla load-balancers create --name mylb
sevalla load-balancers update <id> --display-name "My LB"
sevalla load-balancers delete <id>
```

### Load Balancer Destinations

```bash
sevalla load-balancers destinations list --lb-id <id>
sevalla load-balancers destinations create <lb-id> --application-id <id>
sevalla load-balancers destinations toggle <lb-id> <destination-id>
sevalla load-balancers destinations delete <lb-id> <destination-id>
```

### Load Balancer Domains

```bash
sevalla load-balancers domains list --lb-id <id>
sevalla load-balancers domains get <domain-id> --lb-id <id>
sevalla load-balancers domains add <lb-id> --name example.com
sevalla load-balancers domains update <domain-id> --lb-id <id>
sevalla load-balancers domains delete <lb-id> <domain-id>
sevalla load-balancers domains set-primary <lb-id> <domain-id>
sevalla load-balancers domains toggle <lb-id> <domain-id>
sevalla load-balancers domains refresh-status <lb-id> <domain-id>
```

### Object Storage

```bash
sevalla object-storage list
sevalla object-storage get <id>
sevalla object-storage create --name mybucket
sevalla object-storage update <id> --display-name "My Bucket"
sevalla object-storage delete <id>
```

### Object Storage CDN Domain

```bash
sevalla object-storage cdn-domain enable <bucket-id>
sevalla object-storage cdn-domain disable <bucket-id>
```

### Object Storage CORS Policies

```bash
sevalla object-storage cors-policies list --bucket-id <id>
sevalla object-storage cors-policies create <bucket-id>
sevalla object-storage cors-policies update <policy-id> --bucket-id <id>
sevalla object-storage cors-policies delete <bucket-id> <policy-id>
```

### Object Storage Objects

```bash
sevalla object-storage objects list --bucket-id <id>
sevalla object-storage objects delete <bucket-id>
```

### Pipelines

```bash
sevalla pipelines list
sevalla pipelines get <id>
sevalla pipelines create --name mypipeline --type trunk
sevalla pipelines update <id> --name "My Pipeline"
sevalla pipelines delete <id>
sevalla pipelines promote <id>
```

### Pipeline Stages

```bash
sevalla pipelines stages create <pipeline-id> --name staging
sevalla pipelines stages delete <pipeline-id> <stage-id>
sevalla pipelines stages apps add <pipeline-id> <stage-id> <app-id>
sevalla pipelines stages apps remove <pipeline-id> <stage-id> <app-id>
```

### Pipeline Preview

```bash
sevalla pipelines preview enable <pipeline-id>
sevalla pipelines preview disable <pipeline-id>
sevalla pipelines preview update <pipeline-id>
```

### Projects

```bash
sevalla projects list
sevalla projects get <id>
sevalla projects create --name myproject
sevalla projects update <id> --name "My Project"
sevalla projects delete <id>
sevalla projects services add <project-id>
sevalla projects services remove <project-id> <service-id>
```

### Docker Registries

```bash
sevalla docker-registries list
sevalla docker-registries get <id>
sevalla docker-registries create --name myregistry --username user --secret token
sevalla docker-registries update <id>
sevalla docker-registries delete <id>
```

### Webhooks

```bash
sevalla webhooks list
sevalla webhooks get <id>
sevalla webhooks create --endpoint https://example.com/hook --events "deployment.started"
sevalla webhooks update <id>
sevalla webhooks delete <id>
sevalla webhooks toggle <id>
sevalla webhooks roll-secret <id>
sevalla webhooks deliveries list --webhook-id <id>
sevalla webhooks deliveries get <delivery-id> --webhook-id <id>
```

### API Keys

```bash
sevalla api-keys list
sevalla api-keys get <id>
sevalla api-keys create --name "My Key"
sevalla api-keys update <id>
sevalla api-keys delete <id>
sevalla api-keys toggle <id>
sevalla api-keys rotate <id>
sevalla api-keys validate
```

### Global Environment Variables

```bash
sevalla global-env-vars list
sevalla global-env-vars create --key MY_VAR --value "my value"
sevalla global-env-vars update <id>
sevalla global-env-vars delete <id>
```

### Resources

```bash
sevalla resources clusters
sevalla resources db-types
sevalla resources process-types
```

### Git

```bash
sevalla git providers
```

### Users

```bash
sevalla users list
```

## Global Options

Every command accepts these flags:

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON (for scripting and CI/CD) |
| `--api-url <url>` | Override API base URL |
| `--confirm` | Skip confirmation on destructive operations |
| `--version` | Show version |
| `--help` | Show help |

```bash
# Pipe JSON output to jq
sevalla apps list --json | jq '.[].name'

# Use in scripts
APP_ID=$(sevalla apps list --json | jq -r '.[0].id')
sevalla apps get $APP_ID --json
```

## Shell Completion

Enable tab completion for commands, subcommands, and options.

### Bash

```bash
# Add to ~/.bashrc
eval "$(sevalla completion bash)"
```

### Zsh

```bash
# Add to ~/.zshrc
eval "$(sevalla completion zsh)"
```

### Fish

```bash
# Add to ~/.config/fish/config.fish
sevalla completion fish | source
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SEVALLA_API_TOKEN` | API token for authentication (overrides stored credentials) |
| `SEVALLA_API_URL` | Override API base URL |

## Development

```bash
git clone https://github.com/sevalla-hosting/cli.git
cd sevalla-cli
npm install
```

```bash
npm run dev -- apps list    # Run in development
npm test                    # Run tests (node:test)
npm run typecheck           # Type check (tsc --noEmit)
npm run lint                # Lint (eslint)
npm run format:check        # Format check (prettier)
npm run build               # Build (tsup)
```

## License

[MIT](LICENSE)
