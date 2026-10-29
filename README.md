<div align="center">

<img src="https://assets.sevalla.com/brand/logo/svg/sevalla-mark-color.svg" alt="" width="64" height="64" />

# Sevalla CLI

**Deploy and manage Sevalla from your terminal.**

[![CI](https://github.com/sevalla/cli/actions/workflows/ci.yml/badge.svg)](https://github.com/sevalla/cli/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@sevalla/cli?color=57534e)](https://www.npmjs.com/package/@sevalla/cli)
[![License: MIT](https://img.shields.io/badge/license-MIT-57534e)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22+-57534e?logo=node.js&logoColor=white)](https://nodejs.org/)

[Docs](https://docs.sevalla.com) · [Sevalla](https://sevalla.com)

</div>

Deploy and manage applications, databases and static sites on [Sevalla](https://sevalla.com) from your terminal: trigger deployments, set environment variables, add domains, read logs and watch metrics. Every command takes `--json`, so the same commands work in scripts and CI/CD.

## Install

```sh
# Homebrew
brew install sevalla/tap/sevalla

# npm (requires Node.js 22+)
npm install -g @sevalla/cli

# Shell script
bash <(curl -fsSL https://raw.githubusercontent.com/sevalla/cli/main/install.sh)
```

Windows binaries are on the [releases page](https://github.com/sevalla/cli/releases/latest).

## Quick start

```sh
# Sign in through your browser
sevalla login

# List your applications and their IDs
sevalla apps list

# Deploy an application's main branch
sevalla apps deployments trigger <app-id> --branch main
```

## Usage

### Applications

```sh
sevalla apps list
sevalla apps list --search storefront --status deploymentFailed
sevalla apps get <id>
sevalla apps create --name storefront --source privateGit --cluster <id>
sevalla apps update <id> --display-name "Storefront"
# Ingot is the default build type; nixpacks is deprecated
sevalla apps update <id> --build-type ingot
sevalla apps delete <id>
sevalla apps activate <id>
sevalla apps suspend <id> --confirm
sevalla apps clone <id> --display-name "Storefront staging" --cluster <id>
sevalla apps purge-cache <id>
sevalla apps cdn-toggle <id>
sevalla apps edge-cache-toggle <id>
sevalla apps egress-ips <id>
```

### Application Dockerfiles

```sh
# Dockerfiles Ingot generated, or the repository's own, one version per change
sevalla apps dockerfiles list --app-id <id>
sevalla apps dockerfiles get <dockerfile-id> --app-id <id>
```

### Application repository

```sh
sevalla apps repository get <app-id>
sevalla apps repository tree <app-id> --path src
sevalla apps repository contents <app-id> --path package.json --ref main
sevalla apps repository search <app-id> --query createServer
```

### Maintenance mode

```sh
sevalla apps maintenance-mode get <app-id>
sevalla apps maintenance-mode update <app-id> --enabled true --page-url https://status.example.com
sevalla apps maintenance-mode update <app-id> --enabled false
```

### Application internal connections

```sh
sevalla apps internal-connections list --app-id <id>
sevalla apps internal-connections create <app-id> --target-id <db-id> --target-type database
sevalla apps internal-connections delete <app-id> <connection-id> --confirm
```

### Deployments

```sh
sevalla apps deployments list --app-id <id>
sevalla apps deployments get <deployment-id> --app-id <id>
sevalla apps deployments trigger <app-id> --branch main
sevalla apps deployments trigger <app-id> --commit <sha> --skip-build-cache
sevalla apps deployments trigger <app-id> --restart
sevalla apps deployments rollback <app-id>
sevalla apps deployments cancel <deployment-id> --app-id <id>
sevalla apps deployments logs <deployment-id> --app-id <id>
```

### Processes

```sh
sevalla apps processes list --app-id <id>
sevalla apps processes get <process-id> --app-id <id>
sevalla apps processes create <app-id> --name web --type web --resource-type <id>
sevalla apps processes update <process-id> --app-id <id> --instances 3
sevalla apps processes delete <process-id> --app-id <id> --confirm
sevalla apps processes create <app-id> --name nightly --type cron --resource-type <id> \
  --command "npm run report" --schedule "0 3 * * *" --concurrency-policy Replace --max-run-time 3600
sevalla apps processes trigger <process-id> --app-id <id>
sevalla apps processes runs --app-id <id> --process-id <id>
# exec exits with the command's exit code; terminal opens an interactive shell
sevalla apps processes exec <process-id> --app-id <id> -- ls -la /app
sevalla apps processes terminal <process-id> --app-id <id> --shell bash
sevalla apps processes disk update <process-id> --app-id <id> --resource-type <id> --mount-path /var/lib/data
sevalla apps processes disk delete <process-id> --app-id <id> --confirm
```

### Process metrics

```sh
sevalla apps processes metrics cpu-usage <app-id> <process-id>
sevalla apps processes metrics cpu-limit <app-id> <process-id>
sevalla apps processes metrics memory-usage <app-id> <process-id>
sevalla apps processes metrics memory-limit <app-id> <process-id>
sevalla apps processes metrics instance-count <app-id> <process-id>
```

### Application domains

```sh
sevalla apps domains list --app-id <id>
sevalla apps domains add <app-id> --name shop.example.com
sevalla apps domains get <domain-id> --app-id <id>
sevalla apps domains update <domain-id> --app-id <id> --name storefront
sevalla apps domains delete <app-id> <domain-id>
sevalla apps domains set-primary <app-id> <domain-id>
sevalla apps domains toggle <app-id> <domain-id>
sevalla apps domains refresh-status <app-id> <domain-id>
```

### Application environment variables

```sh
# Values are hidden; add --show-values to see them
sevalla apps env-vars list --app-id <id>
sevalla apps env-vars create <app-id> --key MY_VAR --value "my value"
sevalla apps env-vars update <env-var-id> --app-id <id> --value "new value"
sevalla apps env-vars delete <app-id> <env-var-id>
```

### Application logs

```sh
sevalla apps logs runtime <app-id>
sevalla apps logs runtime <app-id> --search "connection refused" --from 2026-10-29T10:00:00Z --order desc
sevalla apps logs access <app-id>
```

### Application metrics

```sh
sevalla apps metrics requests-per-minute <app-id>
sevalla apps metrics response-time <app-id> --percent 95
sevalla apps metrics response-time-avg <app-id>
sevalla apps metrics status-codes <app-id>
sevalla apps metrics top-status-codes <app-id>
sevalla apps metrics top-countries <app-id>
sevalla apps metrics slowest-requests <app-id>
sevalla apps metrics top-pages <app-id>
```

### Application IP restriction

```sh
sevalla apps ip-restriction get <app-id>
sevalla apps ip-restriction update <app-id> --type allow --ip-list "1.2.3.4,5.6.7.8" --enabled true
```

### TCP proxies

```sh
sevalla apps tcp-proxies list --app-id <id>
sevalla apps tcp-proxies create <app-id> --process-id <id> --port 3000
sevalla apps tcp-proxies delete <app-id> <tcp-proxy-id>
```

### Private ports

```sh
sevalla apps private-ports list --app-id <id>
sevalla apps private-ports create <app-id> --process-id <id> --port 8080
sevalla apps private-ports delete <app-id> <private-port-id>
```

### Deployment hook

```sh
sevalla apps deployment-hook get <app-id>
sevalla apps deployment-hook enable <app-id>
sevalla apps deployment-hook disable <app-id> --confirm
sevalla apps deployment-hook regenerate <app-id> --confirm
```

### Databases

```sh
sevalla databases list
sevalla databases list --search storefront --type postgresql
sevalla databases get <id>
sevalla databases create --name storefront-db --type postgresql --db-version 16 \
  --cluster <id> --resource-type <id> --db-name storefront --db-password "$DB_PASSWORD"
sevalla databases update <id> --display-name "Storefront DB"
sevalla databases delete <id>
sevalla databases activate <id>
sevalla databases suspend <id> --confirm
sevalla databases reset-password <id> --new-password "$DB_PASSWORD" --confirm
```

### Database backups

```sh
sevalla databases backups list --db-id <id>
sevalla databases backups create <db-id> --name nightly
sevalla databases backups delete <db-id> <backup-id>
sevalla databases backups restore <db-id> <backup-id> --confirm
```

### Database backup targets

```sh
# Dump backups to Sevalla object storage, or to any S3-compatible bucket
sevalla databases backup-targets list --db-id <id>
sevalla databases backup-targets create <db-id> --name nightly --object-storage <bucket-id>
sevalla databases backup-targets create <db-id> --name offsite --bucket dumps \
  --endpoint https://s3.example.com --region eu-west-1 --access-key "$S3_KEY" --secret-key "$S3_SECRET"
sevalla databases backup-targets update <db-id> <target-id> --schedule "15 3 * * *" --retention-days 30
sevalla databases backup-targets delete <db-id> <target-id> --confirm
```

### Database external backups

```sh
sevalla databases external-backups list --db-id <id>
sevalla databases external-backups create <db-id> --name before-migration
sevalla databases external-backups download-url <db-id> <backup-id>
sevalla databases external-backups restore <db-id> <backup-id> --confirm
sevalla databases external-backups restore <db-id> <backup-id> --target-db <id> --confirm
sevalla databases external-backups delete <db-id> <backup-id> --confirm
```

### Database connections

```sh
sevalla databases connections internal-list --db-id <id>
sevalla databases connections internal-create <db-id> --target-id <app-id>
sevalla databases connections internal-delete <db-id> <connection-id>
sevalla databases connections external-toggle <db-id>
```

### Database metrics

```sh
sevalla databases metrics cpu-usage <id>
sevalla databases metrics cpu-limit <id>
sevalla databases metrics memory-usage <id>
sevalla databases metrics memory-limit <id>
sevalla databases metrics storage-usage <id>
sevalla databases metrics storage-limit <id>
sevalla databases metrics all-storage <id>
sevalla databases metrics used-storage <id>
```

### Database IP restriction

```sh
sevalla databases ip-restriction get <db-id>
sevalla databases ip-restriction update <db-id> --type allow --ip-list "1.2.3.4" --enabled true
```

### Static sites

```sh
sevalla static-sites list
sevalla static-sites get <id>
sevalla static-sites create --name storefront-docs --repository user/repo --branch main
sevalla static-sites update <id> --display-name "Storefront docs"
sevalla static-sites delete <id>
sevalla static-sites purge-cache <id>
```

### Static site deployments

```sh
sevalla static-sites deployments list --site-id <id>
sevalla static-sites deployments get <deployment-id> --site-id <id>
sevalla static-sites deployments trigger <site-id> --branch main
sevalla static-sites deployments cancel <deployment-id> --site-id <id>
sevalla static-sites deployments logs <deployment-id> --site-id <id>
```

### Static site domains

```sh
sevalla static-sites domains list --site-id <id>
sevalla static-sites domains get <domain-id> --site-id <id>
sevalla static-sites domains add <site-id> --name docs.example.com
sevalla static-sites domains update <domain-id> --site-id <id> --name storefront-docs
sevalla static-sites domains delete <site-id> <domain-id>
sevalla static-sites domains set-primary <site-id> <domain-id>
sevalla static-sites domains toggle <site-id> <domain-id>
sevalla static-sites domains refresh-status <site-id> <domain-id>
```

### Static site environment variables

```sh
sevalla static-sites env-vars list --site-id <id>
sevalla static-sites env-vars create <site-id> --key MY_VAR --value "my value"
sevalla static-sites env-vars update <env-var-id> --site-id <id>
sevalla static-sites env-vars delete <site-id> <env-var-id>
```

### Static site repository

```sh
sevalla static-sites repository get <site-id>
sevalla static-sites repository tree <site-id>
sevalla static-sites repository contents <site-id> --path index.html
sevalla static-sites repository search <site-id> --query footer
```

### Static site logs

```sh
sevalla static-sites logs access <site-id>
sevalla static-sites logs access <site-id> --search /checkout --limit 100
```

### Static site metrics

```sh
sevalla static-sites metrics requests-per-minute <site-id>
sevalla static-sites metrics response-time <site-id> --percent 95
sevalla static-sites metrics response-time-avg <site-id>
sevalla static-sites metrics status-codes <site-id>
sevalla static-sites metrics top-status-codes <site-id>
sevalla static-sites metrics top-countries <site-id>
sevalla static-sites metrics slowest-requests <site-id>
sevalla static-sites metrics top-pages <site-id>
```

### Load balancers

```sh
sevalla load-balancers list
sevalla load-balancers get <id>
sevalla load-balancers create --name storefront-lb
sevalla load-balancers update <id> --display-name "Storefront LB"
sevalla load-balancers delete <id>
```

### Load balancer destinations

```sh
sevalla load-balancers destinations list --lb-id <id>
sevalla load-balancers destinations create <lb-id> --service-type APP --service-id <app-id>
sevalla load-balancers destinations toggle <lb-id> <destination-id>
sevalla load-balancers destinations delete <lb-id> <destination-id>
```

### Load balancer domains

```sh
sevalla load-balancers domains list --lb-id <id>
sevalla load-balancers domains get <domain-id> --lb-id <id>
sevalla load-balancers domains add <lb-id> --name shop.example.com
sevalla load-balancers domains update <domain-id> --lb-id <id> --name storefront-lb
sevalla load-balancers domains delete <lb-id> <domain-id>
sevalla load-balancers domains set-primary <lb-id> <domain-id>
sevalla load-balancers domains toggle <lb-id> <domain-id>
sevalla load-balancers domains refresh-status <lb-id> <domain-id>
```

### Object storage

```sh
sevalla object-storage list
sevalla object-storage get <id>
sevalla object-storage create --name storefront-assets
sevalla object-storage update <id> --display-name "Storefront assets"
sevalla object-storage delete <id>
sevalla object-storage rotate-credentials <id> --old-keys-ttl-hours 24 --confirm
sevalla object-storage purge-cache <id>
```

### Object storage CDN domain

```sh
sevalla object-storage cdn-domain enable <bucket-id>
sevalla object-storage cdn-domain disable <bucket-id>
```

### Object storage CORS policies

```sh
sevalla object-storage cors-policies list --bucket-id <id>
sevalla object-storage cors-policies create <bucket-id> --origins "*" --methods GET,HEAD
sevalla object-storage cors-policies update <policy-id> --bucket-id <id> --origins "*" --methods GET
sevalla object-storage cors-policies delete <bucket-id> <policy-id>
```

### Object storage objects

```sh
sevalla object-storage objects list --bucket-id <id>
sevalla object-storage objects delete <bucket-id> --keys a.txt,b.txt --confirm
```

### Pipelines

```sh
sevalla pipelines list
sevalla pipelines list --search storefront
sevalla pipelines get <id>
sevalla pipelines create --name storefront --type trunk
sevalla pipelines update <id> --name "Storefront"
sevalla pipelines delete <id>
sevalla pipelines promote <id> --source-app-id <id> --target-app-ids <id>,<id>
```

### Pipeline stages

```sh
sevalla pipelines stages create <pipeline-id> --name staging
sevalla pipelines stages delete <pipeline-id> <stage-id>
sevalla pipelines stages apps add <pipeline-id> <stage-id> <app-id>
sevalla pipelines stages apps remove <pipeline-id> <stage-id> <app-id> --confirm
```

### Pipeline preview

```sh
sevalla pipelines preview enable <pipeline-id>
sevalla pipelines preview disable <pipeline-id>
sevalla pipelines preview update <pipeline-id> --auto-create-app true
sevalla pipelines preview update <pipeline-id> --preview-app "$(cat preview-app.json)"
sevalla pipelines preview create-app <pipeline-id> --branch feature/checkout
sevalla pipelines preview create-app <pipeline-id> --branch feature/checkout --pull-request 42
```

### Projects

```sh
sevalla projects list
sevalla projects list --search storefront
sevalla projects get <id>
sevalla projects create --name storefront
sevalla projects update <id> --name "Storefront"
sevalla projects delete <id>
sevalla projects services add <project-id> --service-id <id>
sevalla projects services remove <project-id> <service-id> --confirm
```

### Docker registries

```sh
sevalla docker-registries list
sevalla docker-registries get <id>
sevalla docker-registries create --name storefront-registry --username <username> --secret "$REGISTRY_TOKEN"
sevalla docker-registries update <id>
sevalla docker-registries delete <id>
```

### Webhooks

```sh
sevalla webhooks list
sevalla webhooks get <id>
sevalla webhooks create --endpoint https://shop.example.com/webhooks/sevalla --events "deployment.started"
sevalla webhooks update <id>
sevalla webhooks delete <id>
sevalla webhooks toggle <id>
sevalla webhooks roll-secret <id> --confirm
sevalla webhooks deliveries list --webhook-id <id>
sevalla webhooks deliveries get <delivery-id> --webhook-id <id>
```

### API keys

```sh
sevalla api-keys list
sevalla api-keys get <id>
sevalla api-keys create --name "Storefront deploys"
sevalla api-keys update <id>
sevalla api-keys delete <id>
sevalla api-keys toggle <id>
sevalla api-keys rotate <id> --confirm
sevalla api-keys validate
sevalla api-keys current
```

### Global environment variables

```sh
sevalla global-env-vars list
sevalla global-env-vars create --key MY_VAR --value "my value"
sevalla global-env-vars update <id>
sevalla global-env-vars delete <id>
```

### Resources

```sh
sevalla resources clusters
sevalla resources db-types
sevalla resources db-versions --cluster <id> --type postgresql
sevalla resources disk-types
sevalla resources process-types
```

### Git

```sh
sevalla git providers
```

### Users

```sh
sevalla users list
```

### Global options

Every command accepts these flags:

| Option            | Description                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `--json`          | Output as JSON, for scripts and CI/CD                                                                    |
| `--api-url <url>` | Override the API base URL                                                                                |
| `--confirm`       | Required by commands that delete data or can't be undone (suspend, restore, reset or rotate credentials) |
| `--version`       | Show the version                                                                                         |
| `--help`          | Show help                                                                                                |

```sh
# Pipe JSON output to jq
sevalla apps list --json | jq '.[].name'

# Use it in scripts
APP_ID=$(sevalla apps list --json | jq -r '.[0].id')
sevalla apps get "$APP_ID" --json
```

### Shell completion

Tab completion for commands, subcommands and options.

```sh
# Bash: add to ~/.bashrc
eval "$(sevalla completion bash)"
```

```sh
# Zsh: add to ~/.zshrc
eval "$(sevalla completion zsh)"
```

```sh
# Fish: add to ~/.config/fish/config.fish
sevalla completion fish | source
```

## Authentication

### Device authorization (interactive)

The recommended way to sign in: it opens your browser, so there's no token to copy and paste.

```sh
# Sign in through your browser
sevalla login

# Check that you're signed in
sevalla auth status

# Sign out
sevalla logout
```

Credentials are stored at `~/.config/sevalla/credentials.json` with `0600` permissions.

### API token (CI/CD and scripting)

For non-interactive environments, set `SEVALLA_API_TOKEN`. When it's set, it takes priority over stored credentials. In CI, set it from your secret store rather than pasting it into a script.

```sh
# For the current session
export SEVALLA_API_TOKEN=<api-token>
sevalla apps list

# For a single command
SEVALLA_API_TOKEN=<api-token> sevalla apps list
```

Create a token under **Settings → API keys** in the [Sevalla dashboard](https://app.sevalla.com), or with the CLI:

```sh
sevalla api-keys create --name "CI token"
```

### Environment variables

| Variable            | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `SEVALLA_API_TOKEN` | API token for authentication (overrides stored credentials) |
| `SEVALLA_API_URL`   | Override the API base URL                                   |

## Development

```sh
git clone https://github.com/sevalla/cli.git
cd cli
npm install
```

```sh
# Run in development
npm run dev -- apps list

# Run tests (node:test)
npm test

# Type check (tsc --noEmit)
npm run typecheck

# Lint (eslint)
npm run lint

# Check formatting (prettier)
npm run format:check

# Build (tsup)
npm run build
```

## License

MIT. See [LICENSE](LICENSE).
