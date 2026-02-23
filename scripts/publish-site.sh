#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <site-name> <source-dir>" >&2
  exit 1
fi

site="$1"
src_dir="$2"

if [[ ! -d "$src_dir" ]]; then
  echo "Source directory not found: $src_dir" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
site_root="${ROOT_DIR}/content/sites/${site}"
releases_dir="${site_root}/releases"

mkdir -p "${releases_dir}"
release_id="$(date +%Y%m%d%H%M%S)"
new_release="${releases_dir}/${release_id}"
cp -a "${src_dir}"/. "${new_release}"

# Atomic symlink switch: write a temp symlink and move it into place.
tmp_link="${site_root}/.current.${release_id}"
ln -s "releases/${release_id}" "${tmp_link}"
mv -Tf "${tmp_link}" "${site_root}/current"

echo "Published ${site} -> releases/${release_id}"
