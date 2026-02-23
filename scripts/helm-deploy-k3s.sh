#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

namespace="${NAMESPACE:-${USER}}"
release="${RELEASE_NAME:-shared-static-sites}"
image_repo="${IMAGE_REPO:-pdr.jonbesga.com/shared-static-nginx-demo}"
image_tag="${IMAGE_TAG:-$(git rev-parse --short HEAD)}"

host1="${HELLO1_HOST:-hello1.ai201.site}"
host2="${HELLO2_HOST:-hello2.ai201.site}"
host3="${HELLO3_HOST:-hello3.ai201.site}"

helm upgrade --install "$release" ./helm/shared-static-sites \
  --namespace "$namespace" \
  --create-namespace \
  --set image.repository="$image_repo" \
  --set image.tag="$image_tag" \
  --set-string "sites[0].name=hello1" \
  --set-string "sites[0].hosts[0]=$host1" \
  --set-string "sites[1].name=hello2" \
  --set-string "sites[1].hosts[0]=$host2" \
  --set-string "sites[2].name=hello3" \
  --set-string "sites[2].hosts[0]=$host3"

echo "Release: $release"
echo "Namespace: $namespace"
echo "Image: ${image_repo}:${image_tag}"
echo "Hosts: $host1, $host2, $host3"
