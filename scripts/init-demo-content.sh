#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITES_DIR="${ROOT_DIR}/content/sites"

for site in hello1 hello2 hello3; do
  release_dir="${SITES_DIR}/${site}/releases/v1"
  current_link="${SITES_DIR}/${site}/current"
  if [[ ! -d "${release_dir}" ]]; then
    echo "missing release dir: ${release_dir}" >&2
    exit 1
  fi
  ln -sfn "releases/v1" "${current_link}"
  echo "${site}: current -> releases/v1"
done
