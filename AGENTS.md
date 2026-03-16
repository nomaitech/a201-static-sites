# CLAUDE.md

## Purpose

This repo hosts many static sites served by Garage (S3-compatible object storage) in k3s.

Key goals:
- no pod restarts for content updates
- repo folder names are the single source of truth for what sites exist
- one script to deploy everything

## Current Architecture

- Content storage: Garage (namespace `garage`), 3-node StatefulSet
- Web serving: Garage's built-in static website hosting on port `3902`
- Routing: Traefik Ingress → `garage:3902`, host header matched to bucket name
- TLS: cert-manager with `letsencrypt-prod` cluster issuer
- S3 access key for deploys stored in script defaults (override via env vars)

## Host Routing Model

- Hosts are derived from folder names in `sites/`
- Each folder name must exactly match the public host (e.g. `showcase.ai201.site`)
- Garage bucket name must match the host exactly
- `scripts/garage-deploy.sh` handles everything: bucket creation, content sync, Ingress reconciliation

## Content Layout

Per host:
- `sites/<host>/index.html` (and any other assets)

## To add or update a site

```bash
# Add files
mkdir sites/newsite.ai201.site
vim sites/newsite.ai201.site/index.html

# Deploy (creates bucket, syncs content, updates Ingress + TLS)
./scripts/garage-deploy.sh
```

That's it. No pod restarts needed.

## Scripts

- `scripts/garage-deploy.sh`
  - scans `sites/` for host folders
  - creates Garage bucket if missing, enables website mode
  - grants S3 key permissions
  - syncs content via `aws s3 sync --delete`
  - reconciles Traefik Ingress with all current hosts
  - detects stale buckets (dry-run by default, `APPLY=1` to delete)

## Environment variable overrides

| Var | Default | Description |
|-----|---------|-------------|
| `GARAGE_ACCESS_KEY` | (in script) | S3 access key ID |
| `GARAGE_SECRET_KEY` | (in script) | S3 secret key |
| `GARAGE_S3_ENDPOINT` | `http://localhost:13900` | S3 API endpoint |
| `CLUSTER_ISSUER` | `letsencrypt-prod` | cert-manager cluster issuer |
| `APPLY` | `0` | Set to `1` to delete stale buckets |

## What never requires a rollout

Everything. Content updates, new sites, removed sites — all handled by syncing to Garage and updating the Ingress. Garage pods are not touched during deploys.

## Renaming or removing a site

```bash
# Rename
mv sites/old.ai201.site sites/new.ai201.site
./scripts/garage-deploy.sh           # creates new bucket, syncs, updates Ingress
APPLY=1 ./scripts/garage-deploy.sh  # removes old bucket

# Remove
rm -rf sites/old.ai201.site
APPLY=1 ./scripts/garage-deploy.sh
```

## Deletion Policy For Old Source Folders

Delete old `~/VibeProjects/<site>` source folders only after:
- site content exists in `sites/<host>/`
- Garage is serving the host successfully
