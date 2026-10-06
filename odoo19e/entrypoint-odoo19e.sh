#!/usr/bin/env bash
set -euo pipefail

SRC="${ODOO_SRC:-/opt/odoo19e}"
CONF="${ODOO_RC:-/etc/odoo/odoo.conf}"

build_addons_path() {
  local paths=()
  [[ -d "${SRC}/odoo/addons" ]] && paths+=("${SRC}/odoo/addons")
  [[ -d "${SRC}/addons" ]] && paths+=("${SRC}/addons")
  [[ -d "${SRC}/odoo/addons" && -d "/mnt/extra-addons" ]] && paths+=("/mnt/extra-addons")
  [[ -d "/usr/lib/python3/dist-packages/odoo/addons" ]] && paths+=("/usr/lib/python3/dist-packages/odoo/addons")
  local IFS=,
  echo "${paths[*]}"
}

if [[ -f "${SRC}/odoo-bin" ]]; then
  echo "[odoo19e] Using Enterprise source: ${SRC}"
  ADDONS="$(build_addons_path)"
  echo "[odoo19e] addons_path=${ADDONS}"

  if [[ -f "${SRC}/requirements.txt" && ! -f /var/lib/odoo/.odoo19e-reqs-ok ]]; then
    echo "[odoo19e] Installing Python requirements (first boot)..."
    pip3 install --user --break-system-packages -r "${SRC}/requirements.txt" 2>/dev/null \
      || pip3 install --user -r "${SRC}/requirements.txt" 2>/dev/null \
      || true
    touch /var/lib/odoo/.odoo19e-reqs-ok 2>/dev/null || true
  fi

  # Drop unknown args that image may pass; always use our conf + detected addons
  exec python3 "${SRC}/odoo-bin" \
    -c "${CONF}" \
    --addons-path="${ADDONS}" \
    "$@"
fi

echo "[odoo19e] ERROR: ${SRC}/odoo-bin tidak ditemukan."
echo "[odoo19e] Pastikan folder source Enterprise sudah di-copy ke ./src"
ls -la "${SRC}" | head -40 || true
exit 1
