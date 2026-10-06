#!/usr/bin/env bash
# Isi /opt/odoo/enterprise yang kosong di odoodev2.
#
# Cara A — sumber sudah di-copy ke host (disarankan):
#   bash scripts/fill-enterprise.sh ~/odoo-enterprise-src
#
# Cara B — dari laptop Windows (jalankan di Git Bash / WSL, BUKAN di odoodev2):
#   scp -r "/c/Users/user/odoo-19.0+e.20250918" odoodev2:~/odoo-19.0e-src
#   ssh odoodev2 'bash ~/odoo19e/scripts/fill-enterprise.sh ~/odoo-19.0e-src'
#
# Cara C — clone repo private (butuh akses GitHub odoo/enterprise):
#   bash scripts/fill-enterprise.sh --git

set -euo pipefail

DEST="${ODOO_ENTERPRISE_DIR:-/opt/odoo/enterprise}"
SRC_IN="${1:-}"

need_sudo() {
  if [[ -w "$(dirname "$DEST")" ]] && { [[ ! -e "$DEST" ]] || [[ -w "$DEST" ]]; }; then
    "$@"
  else
    sudo "$@"
  fi
}

sync_tree() {
  local from="$1"
  need_sudo mkdir -p "$DEST"
  if command -v rsync >/dev/null; then
    need_sudo rsync -a --delete "$from"/ "$DEST"/
  else
    need_sudo find "$DEST" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
    need_sudo cp -a "$from"/. "$DEST"/
  fi
}

looks_like_enterprise_addons() {
  local d="$1"
  [[ -d "$d/web_enterprise" ]] || [[ -f "$d/web_enterprise/__manifest__.py" ]] \
    || find "$d" -maxdepth 2 -type d -name web_enterprise 2>/dev/null | grep -q .
}

if [[ "$SRC_IN" == "--git" ]]; then
  TMP="$(mktemp -d)"
  echo "Cloning odoo/enterprise (branch 19.0) → temp..."
  if ! git clone --depth 1 --branch 19.0 git@github.com:odoo/enterprise.git "$TMP/enterprise" \
    && ! git clone --depth 1 --branch 19.0 https://github.com/odoo/enterprise.git "$TMP/enterprise"; then
    echo "ERROR: clone gagal. Repo Enterprise private — pakai copy dari Windows (Cara A/B)."
    rm -rf "$TMP"
    exit 1
  fi
  sync_tree "$TMP/enterprise"
  rm -rf "$TMP"
elif [[ -z "$SRC_IN" ]]; then
  echo "Usage:"
  echo "  $0 /path/ke/sumber-enterprise"
  echo "  $0 --git"
  echo
  echo "Status sekarang:"
  ls -la "$DEST" 2>/dev/null || echo "  (belum ada) $DEST"
  echo
  echo "Dari Windows laptop (Git Bash), copy dulu:"
  echo "  scp -r \"/c/Users/user/odoo-19.0+e.20250918\" odoodev2:~/odoo-19.0e-src"
  exit 1
elif [[ ! -d "$SRC_IN" ]]; then
  echo "ERROR: tidak ditemukan: $SRC_IN"
  exit 1
else
  # Deteksi layout: full +e tree vs folder enterprise addons saja
  if looks_like_enterprise_addons "$SRC_IN"; then
    echo "Layout: enterprise addons → sync ke $DEST"
    sync_tree "$SRC_IN"
  elif [[ -d "$SRC_IN/enterprise" ]] && looks_like_enterprise_addons "$SRC_IN/enterprise"; then
    echo "Layout: subtree enterprise/ → sync ke $DEST"
    sync_tree "$SRC_IN/enterprise"
  elif [[ -f "$SRC_IN/odoo-bin" ]] && looks_like_enterprise_addons "$SRC_IN/addons"; then
    # Paket nightly +e kadang campur enterprise di addons/
    echo "Layout: full tree +e — sync addons/ yang berisi enterprise → $DEST"
    sync_tree "$SRC_IN/addons"
  else
    echo "WARNING: web_enterprise tidak terdeteksi. Tetap sync isi folder apa adanya."
    echo "Isi sumber:"
    ls -la "$SRC_IN" | head -40
    sync_tree "$SRC_IN"
  fi
fi

echo
echo "Isi $DEST (cuplikan):"
ls -la "$DEST" | head -25
if looks_like_enterprise_addons "$DEST"; then
  echo "OK: web_enterprise ditemukan."
else
  echo "WARNING: web_enterprise belum terlihat — cek sumber Enterprise."
  exit 1
fi
