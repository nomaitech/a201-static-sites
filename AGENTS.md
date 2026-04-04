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
- DNS: proxied A records (192.0.2.1) on each site's Cloudflare zone — Worker intercepts before reaching origin
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

# 2. Add a proxied DNS A record (192.0.2.1) for the hostname in Cloudflare dashboard
#    or via API — the Worker intercepts all traffic before it hits the origin

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

# Remove the DNS record from Cloudflare dashboard
# Delete the sites/<host>/ folder from this repo
```

## Worker

- Located in `worker/`
- Deploy with `cd worker && wrangler deploy`
- Routes are defined in `worker/wrangler.toml` — covers all zones with wildcard patterns
- No redeploy needed when adding/removing sites (routing is hostname-based at runtime)

## Deletion Policy For Old Source Folders

Delete old `~/Projects/<site>` source folders only after:
- site content exists in `sites/<host>/`
- Cloudflare is serving the host successfully (check with `curl -I https://<host>`)
