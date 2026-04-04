# a201 Static Sites

Multiple static sites hosted on Cloudflare Workers + R2.

## Architecture

- **Storage**: Cloudflare R2 bucket `static-sites` — files stored as `<hostname>/<path>`
- **Routing**: Cloudflare Worker intercepts requests by hostname and serves the matching R2 object
- **DNS**: Proxied A records (192.0.2.1) on each Cloudflare zone — traffic never reaches an origin server
- **TLS**: Automatic via Cloudflare

## Adding a site

```bash
# 1. Add files
mkdir sites/newsite.ai201.site
# create index.html and assets

# 2. Add a proxied DNS A record pointing to 192.0.2.1 in Cloudflare dashboard

# 3. Commit and push — CI deploys to R2 automatically
git add sites/newsite.ai201.site
git commit -m "feat: add newsite.ai201.site"
git push
```

## Updating a site

Edit files under `sites/<host>/`, then commit and push to `main`. CI detects which sites changed and syncs only those to R2.

## Removing a site

```bash
wrangler r2 object delete static-sites/<host>/index.html --remote
# Remove DNS record from Cloudflare dashboard
rm -rf sites/<host>/
```

## Worker

```bash
cd worker
wrangler deploy   # redeploy after changing wrangler.toml routes
```
