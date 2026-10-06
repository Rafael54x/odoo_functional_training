#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
if [[ ! -d enterprise/web_enterprise ]]; then
  echo "ERROR: enterprise addons missing. Clone with a subscription-linked GitHub token:"
  echo "  git clone --depth 1 --branch 19.0 https://<TOKEN>@github.com/odoo/enterprise.git enterprise"
  exit 1
fi
exec ./venv/bin/python community/odoo-bin \
  -c "$ROOT/config/odoo-source.conf" \
  "$@"
