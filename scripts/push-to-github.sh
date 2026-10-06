#!/usr/bin/env bash
# Push main → https://github.com/Rafael54x/odoo_functional_training.git
#
# Butuh PAT GitHub (classic) dengan scope `repo`, contoh:
#   export GITHUB_TOKEN=ghp_xxxxxxxx
#   bash scripts/push-to-github.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO="https://github.com/Rafael54x/odoo_functional_training.git"
TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"

if [[ -z "$TOKEN" ]]; then
  echo "ERROR: set GITHUB_TOKEN (Personal Access Token, scope repo) dulu."
  echo "  export GITHUB_TOKEN=ghp_..."
  exit 1
fi

git remote remove github 2>/dev/null || true
git remote add github "https://x-access-token:${TOKEN}@github.com/Rafael54x/odoo_functional_training.git"

git push -u github main

# Bersihkan token dari remote URL
git remote set-url github "$REPO"
echo "OK → $REPO"
echo "Vercel akan auto-deploy jika project sudah dihubungkan ke repo ini."
