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
