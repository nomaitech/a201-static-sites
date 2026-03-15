#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

namespace="${NAMESPACE:-${USER}}"
release="${RELEASE_NAME:-shared-static-caddy}"
helper_pod="${HELPER_POD_NAME:-${release}-content-sync}"
helper_image="${HELPER_IMAGE:-alpine:3.20}"
content_root="${CONTENT_ROOT:-sites}"
claim_name="${PVC_NAME:-}"
apply_changes="${APPLY:-0}"

if [[ ! -d "$content_root" ]]; then
  echo "Content root not found: $content_root" >&2
  exit 1
fi

if [[ -z "$claim_name" ]]; then
  claim_name="$(kubectl get pvc -n "$namespace" -l app.kubernetes.io/instance="$release" -o jsonpath='{.items[0].metadata.name}')"
fi

if [[ -z "$claim_name" ]]; then
  echo "Could not determine PVC for release '$release' in namespace '$namespace'. Set PVC_NAME." >&2
  exit 1
fi

mapfile -t local_sites < <(find "$content_root" -maxdepth 1 -mindepth 1 -type d -printf '%f\n' | sort)

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

mapfile -t remote_sites < <(
  kubectl exec -n "$namespace" "$helper_pod" -- sh -lc '
    for d in /srv/sites/*; do
      [ -d "$d" ] || continue
      basename "$d"
    done | sort
  '
)

keep_set=" $(printf '%s ' "${local_sites[@]-}")"
to_delete=()
for site in "${remote_sites[@]-}"; do
  [[ -z "${site}" ]] && continue
  if [[ "$keep_set" != *" ${site} "* ]]; then
    to_delete+=("$site")
  fi
done

echo "Local sites (${#local_sites[@]}): ${local_sites[*]:-<none>}"
echo "Remote sites (${#remote_sites[@]}): ${remote_sites[*]:-<none>}"

if [[ ${#to_delete[@]} -eq 0 ]]; then
  echo "Nothing to prune."
else
  echo "Sites to prune (${#to_delete[@]}): ${to_delete[*]}"
  if [[ "$apply_changes" == "1" ]]; then
    for site in "${to_delete[@]}"; do
      echo "Deleting /srv/sites/${site}"
      kubectl exec -n "$namespace" "$helper_pod" -- sh -lc "rm -rf '/srv/sites/${site}'"
    done
  else
    echo "Dry run only. Re-run with APPLY=1 to delete."
  fi
fi

echo "Deleting helper pod ${helper_pod}"
kubectl delete pod -n "$namespace" "$helper_pod" --wait=true

