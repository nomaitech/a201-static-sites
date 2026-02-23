#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

namespace="${NAMESPACE:-${USER}}"
release="${RELEASE_NAME:-shared-static-sites}"
helper_pod="${HELPER_POD_NAME:-${release}-content-sync}"
helper_image="${HELPER_IMAGE:-alpine:3.20}"

claim_name="${PVC_NAME:-${release}-shared-static-sites-content}"

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
kubectl cp -n "$namespace" content/sites/. "${helper_pod}:/srv/sites"
kubectl exec -n "$namespace" "$helper_pod" -- sh -lc 'find /srv/sites -maxdepth 3 -type l -ls || true'

echo "Synced content to PVC ${claim_name} in namespace ${namespace}"
echo "Deleting helper pod ${helper_pod}"
kubectl delete pod -n "$namespace" "$helper_pod" --wait=true
