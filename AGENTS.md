# AGENTS.md

## Purpose

This repo hosts many static sites behind one shared Caddy deployment in k3s.

Key goals:
- reduce one-pod-per-site overhead
- keep content updates independent (no pod restart for content-only changes)
- manage host routing from local folder names in git

## Current Architecture

- Helm release: `shared-static-caddy` (name kept for continuity)
- K8s resource names (`Deployment` / `Service` / `Ingress`): `shared-static-sites`
  - implemented via `fullnameOverride: shared-static-sites`
- Runtime: Caddy behind Traefik Ingress
- TLS termination: Traefik (Caddy serves plain HTTP on port `80`)
- Shared content storage: PVC mounted at `/srv/sites`

## Host Routing Model

- Hosts are derived from folder names in `content/caddy-sites/`
- Each folder name must exactly match the public host (e.g. `spermix.ai201.site`)
- `scripts/helm-deploy-caddy-k3s.sh` scans `content/caddy-sites/` and populates:
  - `ingress.hosts[]`
  - `caddy.allowedHosts[]`

This means:
- no hardcoded host lists in repo config
- adding/removing a folder changes the explicit host list on next deploy

## Content Layout (Important)

Per host:
- `content/caddy-sites/<host>/releases/<release-id>/...`
- `content/caddy-sites/<host>/current` -> `releases/<release-id>`

Why this exists:
- atomic symlink switch on live PVC
- safer deploys (avoid partial file state)
- easy rollback by repointing `current`

Git is source history. `releases/current` is runtime deploy safety.

## Caddy Config Reload (Important)

Host-list changes update a ConfigMap (`Caddyfile`).

Automatic reload is implemented with a sidecar:
- container: `caddy-reloader`
- watches `/etc/caddy/Caddyfile`
- runs `caddy reload --address 127.0.0.1:2019 ...`

Important gotcha:
- DO NOT mount `Caddyfile` with `subPath`
- ConfigMap updates do not propagate through `subPath` mounts
- mount the whole `/etc/caddy` directory instead

## PVC / Rename Gotcha (Important)

When resource names were renamed to `shared-static-sites`, auto-reusing the old PVC as `existingClaim` caused the old chart-managed PVC to enter `Terminating`.

Current rule:
- let the chart manage the PVC (`shared-static-sites-content`)
- do not auto-discover/reuse an old PVC in deploy script
- only use `PERSISTENCE_EXISTING_CLAIM` manually when you explicitly mean it

## Scripts

- `scripts/helm-deploy-caddy-k3s.sh`
  - folder-driven host discovery
  - deploys Helm release
  - defaults to `fullnameOverride=shared-static-sites`

- `scripts/k3s-sync-content.sh`
  - additive sync of local `content/caddy-sites/` into PVC
  - does not delete removed host dirs

- `scripts/k3s-publish-site.sh <host> <source-dir>`
  - creates a new release dir on PVC
  - atomically flips `current`
  - content-only update should not restart pods

- `scripts/k3s-prune-content.sh`
  - compares local host folders vs PVC host folders
  - dry-run by default
  - `APPLY=1` deletes stale PVC site dirs

## Cutover Workflow (Per Site)

For source-backed static sites:
1. Copy site assets into `content/caddy-sites/<host>/releases/v1`
2. Create `current -> releases/v1`
3. Commit to git
4. Run `./scripts/helm-deploy-caddy-k3s.sh` (host list updates from folders)
5. Run `./scripts/k3s-sync-content.sh`
6. Verify site via shared Caddy
7. Uninstall old standalone Helm release
8. Optionally prune stale PVC dirs later (`k3s-prune-content.sh`)

For sites without local source (but running in cluster):
- extract files from pod (`kubectl cp ...:/usr/share/nginx/html/...`)
- import into `content/caddy-sites/<host>/releases/v1`
- same cutover steps as above

## What Is Safe vs Requires Rollout

No rollout needed:
- content-only update on existing allowed host via `k3s-publish-site.sh`

May require pod rollout:
- image change
- Caddy deployment template change
- chart changes affecting pod spec

Host-list-only changes:
- should no longer require manual `kubectl rollout restart`
- handled by ConfigMap update + `caddy-reloader` sidecar

## Domain Migration Note

Some migrated sites were renamed from `*.nomaitech.com` to `*.ai201.site`.
- rename folder in `content/caddy-sites/`
- deploy (host list updates)
- sync content
- prune old PVC dirs (`APPLY=1 ./scripts/k3s-prune-content.sh`)

## Deletion Policy For Old Source Folders

Delete old `~/VibeProjects/<site>` source folders only after:
- site content exists in `content/caddy-sites/<host>/`
- shared Caddy is serving the host successfully
- old standalone release is removed (if applicable)

If local source folder does not exist (some sites were imported from running pods), nothing to delete.
