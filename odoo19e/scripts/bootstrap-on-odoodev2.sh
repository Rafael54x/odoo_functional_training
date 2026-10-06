#!/usr/bin/env bash
# Jalankan di odoodev2 (Linux) setelah repo/file odoo19e di-copy ke sana.
# Contoh:
#   bash scripts/bootstrap-on-odoodev2.sh "/home/ubuntu/odoo-19.0+e.20250918"
# Windows path C:\Users\user\odoo-19.0+e.20250918 harus di-copy dulu ke host Linux
# (scp/rsync/WSL path).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_IN="${1:-}"

cd "$ROOT"

if [[ -z "$SRC_IN" ]]; then
  echo "Usage: $0 /path/to/odoo-19.0+e.20250918"
  echo "Copy dulu dari Windows, contoh:"
  echo "  scp -r '/mnt/c/Users/user/odoo-19.0+e.20250918' odoodev2:~/odoo-src/"
  exit 1
fi

if [[ ! -d "$SRC_IN" ]]; then
  echo "ERROR: source tidak ditemukan: $SRC_IN"
  exit 1
fi

rm -rf "$ROOT/src"
mkdir -p "$ROOT/src"
echo "Copying source → $ROOT/src ..."
# Prefer rsync; fallback cp
if command -v rsync >/dev/null; then
  rsync -a --delete "$SRC_IN"/ "$ROOT/src"/
else
  cp -a "$SRC_IN"/. "$ROOT/src"/
fi

if [[ ! -f "$ROOT/src/odoo-bin" && ! -d "$ROOT/src/odoo" ]]; then
  echo "WARNING: layout source tidak standar (tidak ada odoo-bin / odoo/). Cek isi folder."
  ls -la "$ROOT/src" | head -30
fi

# Free / pick port 8070
if ss -tlnp 2>/dev/null | grep -q ':8070 '; then
  echo "WARNING: port 8070 sudah dipakai. Stop service yang bentrok atau ubah mapping di docker-compose.yml"
  ss -tlnp | grep ':8070 ' || true
fi

echo "Building & starting odoo19e ..."
docker compose down 2>/dev/null || true
docker compose up -d --build

echo
echo "Menunggu Odoo siap..."
for i in $(seq 1 60); do
  if curl -sf -m 3 http://127.0.0.1:8070/web/login >/dev/null 2>&1; then
    echo "OK Odoo up: http://172.16.2.123:8070"
    echo "Buat database baru: odoo_functional (Master password: admin, user admin/admin, tanpa demo data)"
    exit 0
  fi
  sleep 3
done

echo "Container jalan tapi /web/login belum merespons. Cek log:"
echo "  docker compose -f $ROOT/docker-compose.yml logs --tail=100 odoo"
exit 1
