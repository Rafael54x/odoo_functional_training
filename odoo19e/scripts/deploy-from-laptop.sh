#!/usr/bin/env bash
# Jalankan dari laptop Anda (yang bisa SSH ke odoodev2 dan lihat folder Windows).
# Contoh:
#   bash odoo19e/scripts/deploy-from-laptop.sh odoodev2 "/c/Users/user/odoo-19.0+e.20250918"
#
set -euo pipefail

HOST="${1:-odoodev2}"
WIN_SRC="${2:-/c/Users/user/odoo-19.0+e.20250918}"
REMOTE_DIR="~/odoo19e"
REMOTE_SRC="~/odoo-19.0e-src"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> 1) Upload folder odoo19e ke ${HOST}:${REMOTE_DIR}"
ssh "$HOST" "mkdir -p ${REMOTE_DIR}"
rsync -az --delete \
  --exclude 'src/' \
  --exclude '.git/' \
  "$ROOT"/ "$HOST:${REMOTE_DIR}/"

echo "==> 2) Upload source Enterprise dari ${WIN_SRC}"
if [[ ! -d "$WIN_SRC" ]]; then
  echo "ERROR: Source tidak ada di laptop: $WIN_SRC"
  echo "Sesuaikan path (WSL: /mnt/c/Users/user/odoo-19.0+e.20250918)"
  exit 1
fi
ssh "$HOST" "mkdir -p ${REMOTE_SRC}"
rsync -az --delete "$WIN_SRC"/ "$HOST:${REMOTE_SRC}/"

echo "==> 3) Bootstrap Docker di ${HOST}"
ssh "$HOST" "cd ${REMOTE_DIR} && bash scripts/bootstrap-on-odoodev2.sh ${REMOTE_SRC}"

echo
echo "Selesai. Buka: http://172.16.2.123:8070"
echo "Buat DB odoo_functional (master pwd admin, user admin/admin, tanpa demo)."
