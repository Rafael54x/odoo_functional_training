#!/usr/bin/env bash
# Jalankan di odoodev2 setelah /opt/odoo/enterprise terisi.
#   cd ~/odoo19e && bash scripts/start-on-odoodev2.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COMMUNITY="${ODOO_COMMUNITY_DIR:-/opt/odoo/community}"
ENTERPRISE="${ODOO_ENTERPRISE_DIR:-/opt/odoo/enterprise}"

cd "$ROOT"

echo "==> Cek layout /opt/odoo"
if [[ ! -f "${COMMUNITY}/odoo-bin" ]]; then
  echo "ERROR: ${COMMUNITY}/odoo-bin tidak ada."
  echo "Isi community dulu (branch 19.0). Contoh isi:"
  ls -la "${COMMUNITY}" 2>/dev/null | head -20 || true
  exit 1
fi

if [[ -z "$(ls -A "${ENTERPRISE}" 2>/dev/null || true)" ]]; then
  echo "ERROR: ${ENTERPRISE} masih kosong."
  echo
  echo "Dari laptop Windows (Git Bash / WSL):"
  echo "  scp -r \"/c/Users/user/odoo-19.0+e.20250918\" odoodev2:~/odoo-19.0e-src"
  echo "  ssh odoodev2"
  echo "  bash ~/odoo19e/scripts/fill-enterprise.sh ~/odoo-19.0e-src"
  echo
  echo "Lalu jalankan ulang script ini."
  exit 1
fi

if ! command -v docker >/dev/null; then
  echo "ERROR: docker belum terpasang. Install Docker lalu ulang."
  exit 1
fi

# Pastikan user bisa docker (atau pakai sudo)
DOCKER=(docker)
if ! docker info >/dev/null 2>&1; then
  if sudo docker info >/dev/null 2>&1; then
    DOCKER=(sudo docker)
  else
    echo "ERROR: tidak bisa akses Docker daemon."
    exit 1
  fi
fi

COMPOSE=("${DOCKER[@]}" compose)
if ! "${COMPOSE[@]}" version >/dev/null 2>&1; then
  COMPOSE=("${DOCKER[@]}" compose)
fi

if ss -tlnp 2>/dev/null | grep -q ':8070 '; then
  echo "WARNING: port 8070 sudah dipakai:"
  ss -tlnp | grep ':8070 ' || true
fi

echo "==> Build & start odoo19e (port 8070)"
"${COMPOSE[@]}" down 2>/dev/null || true
"${COMPOSE[@]}" up -d --build

echo
echo "==> Menunggu http://127.0.0.1:8070/web/login ..."
for i in $(seq 1 80); do
  if curl -sf -m 3 http://127.0.0.1:8070/web/login >/dev/null 2>&1; then
    echo
    echo "OK — Odoo 19 Enterprise siap"
    echo "  URL : http://172.16.2.123:8070"
    echo "  DB  : buat odoo_functional"
    echo "  Master password: admin"
    echo "  User/pass      : admin / admin (tanpa demo data)"
    exit 0
  fi
  sleep 3
done

echo
echo "Container jalan tapi login page belum merespons. Cek log:"
echo "  cd $ROOT && ${COMPOSE[*]} logs --tail=120 odoo"
exit 1
