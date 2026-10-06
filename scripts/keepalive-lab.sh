#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
URL_FILE="$ROOT/public/tunnel-url.txt"
LOG=/tmp/cloudflared-tunnel.log

# Ensure Next.js
if ! curl -sf -m 3 http://127.0.0.1:43129/ >/dev/null; then
  echo "Next down — restarting"
  tmux -f /exec-daemon/tmux.portal.conf has-session -t "=odoo-lab-dev" 2>/dev/null || \
    tmux -f /exec-daemon/tmux.portal.conf new-session -d -s "odoo-lab-dev" -c "$ROOT" -- "${SHELL:-zsh}" -l
  tmux -f /exec-daemon/tmux.portal.conf send-keys -t "odoo-lab-dev:0.0" C-c
  sleep 1
  tmux -f /exec-daemon/tmux.portal.conf send-keys -t "odoo-lab-dev:0.0" 'npm run dev' C-m
  sleep 5
fi

# Ensure tunnel WITHOUT restarting if already healthy with known URL
OLD_URL="$(cat "$URL_FILE" 2>/dev/null || true)"
if [[ -n "${OLD_URL}" ]] && curl -sf -m 15 "${OLD_URL}/" >/dev/null; then
  echo "OK same URL: $OLD_URL"
  exit 0
fi

# Tunnel dead or URL unreachable — recreate (URL will change)
echo "Tunnel unreachable — recreating (URL will change)"
tmux -f /exec-daemon/tmux.portal.conf has-session -t "=odoo-lab-tunnel" 2>/dev/null || \
  tmux -f /exec-daemon/tmux.portal.conf new-session -d -s "odoo-lab-tunnel" -c "$ROOT" -- "${SHELL:-zsh}" -l
tmux -f /exec-daemon/tmux.portal.conf send-keys -t "odoo-lab-tunnel:0.0" C-c
sleep 1
: > "$LOG"
tmux -f /exec-daemon/tmux.portal.conf send-keys -t "odoo-lab-tunnel:0.0" "cloudflared tunnel --url http://127.0.0.1:43129 --no-autoupdate 2>&1 | tee $LOG" C-m
for i in $(seq 1 30); do
  sleep 2
  NEW=$(rg -o 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" 2>/dev/null | tail -1 || true)
  if [[ -n "$NEW" ]]; then
    echo "$NEW" > "$URL_FILE"
    echo "NEW URL: $NEW"
    exit 0
  fi
done
echo "FAILED to recreate tunnel"
exit 1
