# Shared Static Sites Demo (Caddy)

Shared Caddy deployment serving multiple static sites from one PVC. Each site uses a host-named directory and immutable releases with a `current` symlink.

## Layout

- `helm/shared-static-caddy/`: Helm chart (Caddy + PVC + explicit ingress hosts)
- `content/caddy-sites/<host>/releases/<release>/...`: immutable releases
- `content/caddy-sites/<host>/current`: active release symlink
- `scripts/k3s-sync-content.sh`: sync seed content into the PVC
- `scripts/k3s-publish-site.sh`: publish one host's content with atomic symlink switch

## Deploy to k3s

1. Build and push the Caddy image (tag = Git SHA):

```bash
./scripts/build-and-push-caddy-image.sh
```

2. Deploy Caddy with explicit hosts discovered from `content/caddy-sites/`:

```bash
IMAGE_TAG=<pushed-tag> \
./scripts/helm-deploy-caddy-k3s.sh
```

The script reads hostnames from the folder names in `content/caddy-sites/` (for example `hello1.ai201.site/`, `hello2.ai201.site/`) and passes them into Helm.

3. Seed the PVC with demo content:

```bash
./scripts/k3s-sync-content.sh
```

## Content-Only Update (No Pod Restart)

Publish a new release for an existing host directly into the shared PVC:

```bash
./scripts/k3s-publish-site.sh hello1.ai201.site /path/to/new/site-build
```

This updates only that host's `current` symlink. Caddy pods do not restart.

## Adding a New Site

With the current explicit-host setup, adding `hello4.ai201.site` requires:

1. Add `hello4.ai201.site` to Caddy allowed hosts and ingress hosts (Helm values/script)
2. Run `./scripts/helm-deploy-caddy-k3s.sh` (it re-reads folder names and updates explicit hosts)
3. Publish `hello4.ai201.site` content to the PVC

That is the tradeoff for explicit host safety (no wildcard ingress).
