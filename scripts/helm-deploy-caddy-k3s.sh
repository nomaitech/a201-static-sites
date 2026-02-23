#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

namespace="${NAMESPACE:-${USER}}"
release="${RELEASE_NAME:-shared-static-caddy}"
image_repo="${IMAGE_REPO:-pdr.jonbesga.com/shared-static-caddy-demo}"
image_tag="${IMAGE_TAG:-$(git rev-parse --short HEAD)}"
content_root="${CONTENT_ROOT:-content/caddy-sites}"
fullname_override="${FULLNAME_OVERRIDE:-shared-static-sites}"
existing_claim="${PERSISTENCE_EXISTING_CLAIM:-}"

if [[ ! -d "$content_root" ]]; then
  echo "Content root not found: $content_root" >&2
  exit 1
fi

mapfile -t hosts < <(find "$content_root" -maxdepth 1 -mindepth 1 -type d -printf '%f\n' | sort)

if [[ ${#hosts[@]} -eq 0 ]]; then
  echo "No site folders found in $content_root" >&2
  exit 1
fi

helm_args=(
  helm
  upgrade --install "$release" ./helm/shared-static-caddy
  --namespace "$namespace"
  --create-namespace
  --set "image.repository=$image_repo"
  --set "image.tag=$image_tag"
  --set-string "fullnameOverride=$fullname_override"
)

if [[ -n "$existing_claim" ]]; then
  helm_args+=(--set-string "persistence.existingClaim=$existing_claim")
fi

for i in "${!hosts[@]}"; do
  host="${hosts[$i]}"
  helm_args+=(--set-string "ingress.hosts[$i]=$host")
  helm_args+=(--set-string "caddy.allowedHosts[$i]=$host")
done

"${helm_args[@]}"

echo "Release: $release"
echo "Namespace: $namespace"
echo "Image: ${image_repo}:${image_tag}"
echo "Content root: $content_root"
echo "Fullname override: $fullname_override"
if [[ -n "$existing_claim" ]]; then
  echo "Existing PVC: $existing_claim"
else
  echo "Existing PVC: <chart-managed>"
fi
echo "Hosts: ${hosts[*]}"
