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
