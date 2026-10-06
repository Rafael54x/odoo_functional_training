#!/usr/bin/env bash
# Satu langkah di odoodev2: isi enterprise (opsional arg) lalu start.
#   bash scripts/bootstrap-on-odoodev2.sh [/path/ke/sumber-enterprise]
#
# Tanpa argumen: hanya start (enterprise harus sudah terisi).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_IN="${1:-}"

if [[ -n "$SRC_IN" ]]; then
  bash "$ROOT/scripts/fill-enterprise.sh" "$SRC_IN"
fi

bash "$ROOT/scripts/start-on-odoodev2.sh"
