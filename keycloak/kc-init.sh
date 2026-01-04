#!/usr/bin/env bash
set -euo pipefail

KC_URL="http://127.0.0.1:8080"
REALM="ip_cv_realm"
CLIENT_ID="ip_cv_api"

echo "[kc-init]Configuring kcadm..."
echo "[kc-init] Waiting for Keycloak HTTP endpoint..."

for i in {1..30}; do
  if /opt/keycloak/bin/kcadm.sh config credentials \
      --server "$KC_URL" \
      --realm master \
      --user "${KEYCLOAK_ADMIN}" \
      --password "${KEYCLOAK_ADMIN_PASSWORD}" >/dev/null 2>&1; then
    echo "[kc-init] Logged into Keycloak."
    break
  fi

  echo "[kc-init] Keycloak not ready yet ($i/30), retrying..."
  sleep 2

  if [ "$i" -eq 30 ]; then
    echo "[kc-init] ERROR: Could not connect to Keycloak"
    exit 1
  fi
done


echo "[kc-init] Granting realm-management roles to service-account-$CLIENT_ID ..."

# Find service account user id (Keycloak API endpoint)
CID=$(
  /opt/keycloak/bin/kcadm.sh get clients -r "$REALM" \
    -q clientId="$CLIENT_ID" \
    --fields id \
    --format csv \
  | tail -n 1 | tr -d '"'
)
SVC_UID=$(
  /opt/keycloak/bin/kcadm.sh get "clients/$CID/service-account-user" -r "$REALM" \
    --fields id \
    --format csv \
  | tail -n 1 | tr -d '"'
)

# Assign roles from realm-management client
/opt/keycloak/bin/kcadm.sh add-roles -r "$REALM" \
  --uid "$SVC_UID" \
  --cclientid realm-management \
  --rolename manage-users

/opt/keycloak/bin/kcadm.sh add-roles -r "$REALM" \
  --uid "$SVC_UID" \
  --cclientid realm-management \
  --rolename view-users

echo "[kc-init] Done."
