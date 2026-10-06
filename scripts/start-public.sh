#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Starting Next.js on 0.0.0.0:43129 ..."
npm run dev &
sleep 2
echo "Starting public Cloudflare quick tunnel..."
echo "Copy the https://*.trycloudflare.com URL below and open it on any device."
cloudflared tunnel --url http://127.0.0.1:43129 --no-autoupdate
