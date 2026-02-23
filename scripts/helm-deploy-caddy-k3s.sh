#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

namespace="${NAMESPACE:-${USER}}"
release="${RELEASE_NAME:-shared-static-caddy}"
image_repo="${IMAGE_REPO:-pdr.jonbesga.com/shared-static-caddy-demo}"
image_tag="${IMAGE_TAG:-$(git rev-parse --short HEAD)}"
wildcard_host="${WILDCARD_HOST:-*.shared.ai201.site}"

helm upgrade --install "$release" ./helm/shared-static-caddy \
  --namespace "$namespace" \
  --create-namespace \
  --set image.repository="$image_repo" \
  --set image.tag="$image_tag" \
  --set-string ingress.host="$wildcard_host" \
  --set-string caddy.wildcardHost="$wildcard_host"

echo "Release: $release"
echo "Namespace: $namespace"
echo "Image: ${image_repo}:${image_tag}"
echo "Wildcard host: $wildcard_host"

