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
cd "$ROOT_DIR"

namespace="${NAMESPACE:-${USER}}"
release="${RELEASE_NAME:-shared-static-sites}"
helper_pod="${HELPER_POD_NAME:-${release}-content-sync}"
helper_image="${HELPER_IMAGE:-alpine:3.20}"
claim_name="${PVC_NAME:-${release}-shared-static-sites-content}"
release_id="${RELEASE_ID:-$(date +%Y%m%d%H%M%S)}"

cat <<EOF | kubectl apply -n "$namespace" -f -
apiVersion: v1
kind: Pod
metadata:
  name: ${helper_pod}
spec:
  restartPolicy: Never
  containers:
    - name: shell
      image: ${helper_image}
      command: ["sh", "-lc", "sleep 3600"]
      volumeMounts:
        - name: site-content
          mountPath: /srv/sites
  volumes:
    - name: site-content
      persistentVolumeClaim:
        claimName: ${claim_name}
EOF

kubectl wait -n "$namespace" --for=condition=Ready "pod/${helper_pod}" --timeout=120s
kubectl exec -n "$namespace" "$helper_pod" -- sh -lc "mkdir -p /srv/sites/${site}/releases/${release_id}"
kubectl cp -n "$namespace" "${src_dir}/." "${helper_pod}:/srv/sites/${site}/releases/${release_id}"
kubectl exec -n "$namespace" "$helper_pod" -- sh -lc \
  "ln -s releases/${release_id} /srv/sites/${site}/.current.${release_id} && mv -Tf /srv/sites/${site}/.current.${release_id} /srv/sites/${site}/current"
kubectl exec -n "$namespace" "$helper_pod" -- sh -lc "ls -l /srv/sites/${site}"

echo "Published ${site} -> releases/${release_id} on PVC ${claim_name} (namespace ${namespace})"
echo "Deleting helper pod ${helper_pod}"
kubectl delete pod -n "$namespace" "$helper_pod" --wait=true

