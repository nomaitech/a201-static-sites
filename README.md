# Shared static sites demo (Option 2)

One `nginx` deployment serves multiple static sites by hostname. Each site's files live in a separate directory and are updated independently by switching a `current` symlink.

## Layout

- `nginx/conf.d/sites.conf`: host -> site folder routing
- `content/sites/<site>/releases/<release>/...`: immutable releases
- `content/sites/<site>/current`: symlink to active release
- `scripts/publish-site.sh`: atomic symlink switch for one site

## Local test (Docker)

1. Start the server:

```bash
docker compose up -d
```

2. Request each site by host header:

```bash
curl -H 'Host: hello1.local' http://127.0.0.1:8080/
curl -H 'Host: hello2.local' http://127.0.0.1:8080/
```

## Update only one site (no nginx restart)

Create a new release for `hello1` and flip only that symlink:

```bash
mkdir -p /tmp/hello1-v2
cat >/tmp/hello1-v2/index.html <<'HTML'
<!doctype html><html><body><h1>Hello World 1 - v2</h1></body></html>
HTML
./scripts/publish-site.sh hello1 /tmp/hello1-v2
```

Then re-request:

```bash
curl -H 'Host: hello1.local' http://127.0.0.1:8080/
curl -H 'Host: hello2.local' http://127.0.0.1:8080/
```

Only `hello1` changes.

## k3s example (shared pod + PVC)

Apply the demo resources:

```bash
kubectl apply -f k8s/shared-static-sites.yaml
```

This creates:

- `Deployment` with `replicas: 2` (rolling-safe shared server)
- `Service` and `Ingress` for two hosts
- `PVC` mounted at `/srv/sites`

### Populate the PVC with demo content

The manifest creates the shared web server and content volume, but not the initial files. Copy the local demo content into the mounted PVC from a temporary pod.

Example approach:

1. Launch a temporary pod mounting the same PVC.
2. `kubectl cp content/sites/.` into `/srv/sites` in that pod.
3. Ensure `current` symlinks exist (or run equivalent shell commands in the pod).

In production, replace manual copy with a deploy job or object storage sync and use the same `releases/<id> + current` pattern.

## Why this matches Option 2

- Shared web server pod(s)
- Site assets stored outside the image
- Content deploys do not require rolling the deployment
- One site can be updated without impacting others

## Actual k3s + Helm workflow (recommended for your cluster)

The fixed `nomaitech/web-app` chart is great for simple single-site images, but it does not expose PVC/extra-volume mounts needed for this Option 2 pattern.

- `helm show values` for `web-app-0.0.4` only exposes image/service/resources/ingress values
- No PVC mount support means you cannot mount `/srv/sites` for shared external content

This repo includes a small local Helm chart that keeps the Option 2 behavior while still using Helm for deploys.

### Files for k3s Helm deploy

- `Dockerfile`: thin nginx image for `pdr.jonbesga.com` (config/content mounted at runtime)
- `helm/shared-static-sites`: local Helm chart (Deployment + PVC + Ingress + nginx ConfigMap)
- `scripts/build-and-push-image.sh`: builds/pushes image tagged with Git SHA
- `scripts/helm-deploy-k3s.sh`: Helm deploy to namespace `$USER` (default)
- `scripts/k3s-sync-content.sh`: seeds/syncs `content/sites` into the chart PVC
- `scripts/k3s-publish-site.sh`: publishes one site into the PVC with atomic symlink switch

### Deploy to Jon's k3s cluster

1. Build and push the image (tag = current Git SHA):

```bash
./scripts/build-and-push-image.sh
```

2. Deploy with Helm to your namespace (defaults to `jon` via `$USER`):

```bash
HELLO1_HOST=hello1.ai201.site \
HELLO2_HOST=hello2.ai201.site \
HELLO3_HOST=hello3.ai201.site \
./scripts/helm-deploy-k3s.sh
```

3. Seed the PVC with site content:

```bash
./scripts/k3s-sync-content.sh
```

### Update one site later (without restarting nginx)

Publish one site build directly into the shared PVC and switch only that site's `current` symlink:

```bash
./scripts/k3s-publish-site.sh hello1 /path/to/new/hello1-build
```

Then verify from the running deployment:

```bash
kubectl exec -n "$USER" deploy/shared-static-sites-shared-static-sites -- ls -l /srv/sites/hello1
```

## Caddy wildcard variant (no Helm upgrade for new hosts)

This variant uses Caddy plus a wildcard ingress host (for example `*.shared.ai201.site`) and maps requests to the filesystem path `/srv/sites/{host}/current`.

That means:

- Add a new host by publishing content into a matching directory (for example `hello4.shared.ai201.site`)
- No nginx/caddy config change
- No Helm upgrade
- No pod rollout

### Files

- `helm/shared-static-caddy`: Caddy chart with wildcard ingress + PVC
- `Dockerfile.caddy`: thin runtime image
- `scripts/build-and-push-caddy-image.sh`: push image tagged with Git SHA
- `scripts/helm-deploy-caddy-k3s.sh`: deploy wildcard Caddy release
- `content/caddy-sites/`: seed content keyed by hostname

### Deploy Caddy wildcard release

1. Build and push the Caddy image:

```bash
./scripts/build-and-push-caddy-image.sh
```

2. Deploy a wildcard release:

```bash
WILDCARD_HOST='*.shared.ai201.site' ./scripts/helm-deploy-caddy-k3s.sh
```

3. Seed content into the Caddy PVC:

```bash
RELEASE_NAME=shared-static-caddy CONTENT_ROOT=content/caddy-sites ./scripts/k3s-sync-content.sh
```

### Add a new host later (no rollout)

Publish content directly to a host directory that matches the wildcard:

```bash
RELEASE_NAME=shared-static-caddy ./scripts/k3s-publish-site.sh hello4.shared.ai201.site /path/to/site-build
```

The Caddy config and ingress stay unchanged because routing is wildcard-based.
