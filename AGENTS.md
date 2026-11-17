# AGENTS.md

## Purpose

This repo hosts many static sites served by Cloudflare Workers + R2.

Key goals:
- no infrastructure to manage
- repo folder names are the single source of truth for what sites exist
- deploy by pushing to `main` — CI syncs changed sites to R2 automatically

## Current Architecture

- Content storage: Cloudflare R2 bucket `static-sites`
- Web serving: Cloudflare Worker (`worker/`) routes requests by hostname to the matching folder in R2
- DNS: a proxied wildcard A record `*.ai201.site → 192.0.2.1` covers every subdomain. 192.0.2.1 is a non-routable placeholder (RFC 5737); the Worker answers before Cloudflare would contact it
- Only `ai201.site` is served by the Worker; folders for other domains in `sites/` (e.g. `nomaitech.com`, `philosofriends.com`, `ai201.club`) are synced to R2 but not routed
- TLS: handled automatically by Cloudflare

## Host Routing Model

- Folder name in `sites/` must exactly match the public hostname (e.g. `showcase.ai201.site`)
- R2 keys are structured as `<hostname>/<path>` (e.g. `showcase.ai201.site/index.html`)
- Worker reads the request hostname and maps it to the R2 key prefix

## Content Layout

Per host:
- `sites/<host>/index.html` (and any other assets)

## To add a new site

```bash
# 1. Add content
mkdir sites/newsite.ai201.site
# add index.html and assets

# 2. No DNS step needed — the wildcard *.ai201.site record already covers it

# 3. Commit and push — CI will sync the new site to R2 automatically
git add sites/newsite.ai201.site
git commit -m "feat: add newsite.ai201.site"
git push
```

## To update an existing site

Edit files under `sites/<host>/`, then commit and push to `main`. CI detects which
sites changed and syncs only those to R2.

If you need to sync manually (e.g. bypassing CI):

```bash
for f in $(find ../sites/<host> -type f); do
  key="<host>/${f#../sites/<host>/}"
  wrangler r2 object put "static-sites/$key" --file="$f" --remote
done
```

## To remove a site

```bash
# Delete objects from R2
wrangler r2 object delete static-sites/<host>/index.html --remote
# (repeat for all files)

# Delete the sites/<host>/ folder from this repo
```

## Worker

- Located in `worker/`
- Deploy with `cd worker && wrangler deploy`
- Routes are defined in `worker/wrangler.toml` — only `ai201.site` and `*.ai201.site` are routed; other domains need a route added + `wrangler deploy`
- No redeploy needed when adding/removing `*.ai201.site` sites (routing is hostname-based at runtime)
- If R2 has no object for a request, the Worker falls back to `fetch(request)` (the origin). For `*.ai201.site` that origin is the 192.0.2.1 placeholder, so missing pages time out with a Cloudflare 522 rather than a 404

## Deletion Policy For Old Source Folders

Delete old `~/Projects/<site>` source folders only after:
- site content exists in `sites/<host>/`
- Cloudflare is serving the host successfully (check with `curl -I https://<host>`)
