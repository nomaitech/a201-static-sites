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

- Hosts are derived from folder names in `sites/`
- Each folder name must exactly match the public host (e.g. `showcase.ai201.site`)
- `scripts/helm-deploy-caddy-k3s.sh` scans `sites/` and populates:
  - `ingress.hosts[]`
  - `caddy.allowedHosts[]`

This means:
- no hardcoded host lists in repo config
- adding/removing a folder changes the explicit host list on next deploy

## Content Layout

Per host:
- `sites/<host>/index.html` (and any other assets directly in the folder)

To add or update a site:
1. Put files directly in `sites/<host>/`
2. Commit to git
3. Run `./scripts/helm-deploy-caddy-k3s.sh` (if adding a new host)
4. Run `./scripts/k3s-sync-content.sh`

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
  - additive sync of local `sites/` into PVC
  - does not delete removed host dirs

- `scripts/k3s-prune-content.sh`
  - compares local host folders vs PVC host folders
  - dry-run by default
  - `APPLY=1` deletes stale PVC site dirs

## What Is Safe vs Requires Rollout

No rollout needed:
- content-only update on an existing allowed host (edit files, sync)

May require pod rollout:
- image change
- Caddy deployment template change
- chart changes affecting pod spec

Host-list-only changes:
- should no longer require manual `kubectl rollout restart`
- handled by ConfigMap update + `caddy-reloader` sidecar

## Domain Migration Note

Some migrated sites were renamed from `*.nomaitech.com` to `*.ai201.site`.
- rename folder in `sites/`
- deploy (host list updates)
- sync content
- prune old PVC dirs (`APPLY=1 ./scripts/k3s-prune-content.sh`)

## Deletion Policy For Old Source Folders

Delete old `~/VibeProjects/<site>` source folders only after:
- site content exists in `sites/<host>/`
- shared Caddy is serving the host successfully
- old standalone release is removed (if applicable)

If local source folder does not exist (some sites were imported from running pods), nothing to delete.
