#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

git_sha="$(git rev-parse --short HEAD)"
image_repo="${IMAGE_REPO:-pdr.jonbesga.com/shared-static-caddy-demo}"
image_ref="${image_repo}:${git_sha}"

docker build -f Dockerfile.caddy -t "$image_ref" .
docker push "$image_ref"

echo "$image_ref"

