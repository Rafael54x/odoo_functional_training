#!/usr/bin/env bash
# Hanya upload folder odoo19e ke server (tanpa source Enterprise).
# Berguna jika Anda sudah SSH di odoodev2 dan mau isi enterprise terpisah.
#
#   bash odoo19e/scripts/upload-odoo19e-only.sh odoodev2

set -euo pipefail
HOST="${1:-odoodev2}"
REMOTE_DIR="~/odoo19e"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

ssh "$HOST" "mkdir -p ${REMOTE_DIR}"
rsync -az --delete \
  --exclude 'src/' \
  --exclude '.git/' \
  "$ROOT"/ "$HOST:${REMOTE_DIR}/"

echo "Uploaded. Di odoodev2:"
echo "  ls /opt/odoo/enterprise"
echo "  # jika kosong, dari laptop:"
echo "  scp -r \"/c/Users/user/odoo-19.0+e.20250918\" ${HOST}:~/odoo-19.0e-src"
echo "  ssh ${HOST} \"bash ${REMOTE_DIR}/scripts/bootstrap-on-odoodev2.sh ~/odoo-19.0e-src\""
