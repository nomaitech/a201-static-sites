Create a new static site under `sites/` in this repo based on the following description:

$ARGUMENTS

## Instructions

1. Derive a short, memorable slug from the description (kebab-case, max 3 words). The folder name must be `<slug>.ai201.site`.
2. Use the `frontend-design` skill to generate a polished, production-grade `index.html` for the site. The page should visually match the description's intent — avoid generic AI aesthetics.
3. Place all files under `sites/<slug>.ai201.site/`.
4. Commit with message: `feat(<slug>.ai201.site): add site — <one-line description>`
5. Remind the user to:
   - Add a proxied DNS A record (`192.0.2.1`) for `<slug>.ai201.site` in the Cloudflare dashboard.
   - Push to `main` so CI syncs the site to R2.
