#!/usr/bin/env bash
set -euo pipefail

COMMUNITY="${ODOO_COMMUNITY:-/opt/odoo/community}"
ENTERPRISE="${ODOO_ENTERPRISE:-/opt/odoo/enterprise}"
# Legacy single-tree mount (opsional)
SRC="${ODOO_SRC:-/opt/odoo19e}"
CONF="${ODOO_RC:-/etc/odoo/odoo.conf}"

join_paths() {
  local IFS=,
  echo "$*"
}

build_addons_from_split() {
  local paths=()
  [[ -d "${ENTERPRISE}" ]] && paths+=("${ENTERPRISE}")
  [[ -d "${COMMUNITY}/addons" ]] && paths+=("${COMMUNITY}/addons")
  [[ -d "${COMMUNITY}/odoo/addons" ]] && paths+=("${COMMUNITY}/odoo/addons")
  [[ -d "/mnt/extra-addons" ]] && paths+=("/mnt/extra-addons")
  [[ -d "/usr/lib/python3/dist-packages/odoo/addons" ]] && \
    paths+=("/usr/lib/python3/dist-packages/odoo/addons")
  join_paths "${paths[@]}"
}

build_addons_from_src() {
  local paths=()
  [[ -d "${SRC}/odoo/addons" ]] && paths+=("${SRC}/odoo/addons")
  [[ -d "${SRC}/addons" ]] && paths+=("${SRC}/addons")
  [[ -d "/mnt/extra-addons" ]] && paths+=("/mnt/extra-addons")
  [[ -d "/usr/lib/python3/dist-packages/odoo/addons" ]] && \
    paths+=("/usr/lib/python3/dist-packages/odoo/addons")
  join_paths "${paths[@]}"
}

maybe_install_reqs() {
  local req="$1"
  if [[ -f "${req}" && ! -f /var/lib/odoo/.odoo19e-reqs-ok ]]; then
    echo "[odoo19e] Installing Python requirements (first boot)..."
    pip3 install --user --break-system-packages -r "${req}" 2>/dev/null \
      || pip3 install --user -r "${req}" 2>/dev/null \
      || true
    touch /var/lib/odoo/.odoo19e-reqs-ok 2>/dev/null || true
  fi
}

# Prefer split layout used on odoodev2: /opt/odoo/community + /opt/odoo/enterprise
if [[ -f "${COMMUNITY}/odoo-bin" ]]; then
  if [[ ! -d "${ENTERPRISE}" ]] || [[ -z "$(ls -A "${ENTERPRISE}" 2>/dev/null || true)" ]]; then
    echo "[odoo19e] ERROR: /opt/odoo/enterprise kosong."
    echo "[odoo19e] Isi dulu (lihat scripts/fill-enterprise.sh), lalu restart."
    exit 1
  fi
  if [[ ! -d "${ENTERPRISE}/web_enterprise" && ! -f "${ENTERPRISE}/web_enterprise/__manifest__.py" ]]; then
    # Beberapa layout taruh modul di subfolder; cek longgar
    if ! find "${ENTERPRISE}" -maxdepth 2 -type d -name web_enterprise 2>/dev/null | grep -q .; then
      echo "[odoo19e] WARNING: web_enterprise tidak terlihat di ${ENTERPRISE}."
      echo "[odoo19e] Pastikan ini sumber Odoo Enterprise (bukan folder kosong)."
    fi
  fi

  echo "[odoo19e] Using community: ${COMMUNITY}"
  echo "[odoo19e] Using enterprise: ${ENTERPRISE}"
  ADDONS="$(build_addons_from_split)"
  echo "[odoo19e] addons_path=${ADDONS}"
  maybe_install_reqs "${COMMUNITY}/requirements.txt"

  exec python3 "${COMMUNITY}/odoo-bin" \
    -c "${CONF}" \
    --addons-path="${ADDONS}" \
    "$@"
fi

# Fallback: single Enterprise tree di /opt/odoo19e
if [[ -f "${SRC}/odoo-bin" ]]; then
  echo "[odoo19e] Using single-tree source: ${SRC}"
  ADDONS="$(build_addons_from_src)"
  echo "[odoo19e] addons_path=${ADDONS}"
  maybe_install_reqs "${SRC}/requirements.txt"

  exec python3 "${SRC}/odoo-bin" \
    -c "${CONF}" \
    --addons-path="${ADDONS}" \
    "$@"
fi

echo "[odoo19e] ERROR: odoo-bin tidak ditemukan."
echo "  Cek: ${COMMUNITY}/odoo-bin  atau  ${SRC}/odoo-bin"
ls -la "${COMMUNITY}" 2>/dev/null | head -20 || true
ls -la "${SRC}" 2>/dev/null | head -20 || true
exit 1
