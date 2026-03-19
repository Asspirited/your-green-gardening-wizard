#!/bin/bash
# Auth canary — run at pipeline start
# Returns exit code 0 (green) or 1 (RED — stop everything)
# YGW — Your Green Gardening Wizard

ERRORS=0

# Check 1: Cloudflare token present
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "RED: CLOUDFLARE_API_TOKEN not set"
  echo "     Fix: export CLOUDFLARE_API_TOKEN=<token>"
  echo "     Get token: dash.cloudflare.com → My Profile → API Tokens → Edit Cloudflare Workers"
  ERRORS=$((ERRORS+1))
else
  echo "GREEN: CLOUDFLARE_API_TOKEN present"
fi

# Check 2: Wrangler can reach Cloudflare
if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
  WHOAMI=$(CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" wrangler whoami 2>&1)
  if echo "$WHOAMI" | grep -qi "leanspirited@gmail.com"; then
    echo "GREEN: Cloudflare auth valid (leanspirited@gmail.com)"
  else
    echo "RED: Cloudflare auth failed — token may be expired"
    echo "     Fix: dash.cloudflare.com → My Profile → API Tokens → Create Token → Edit Cloudflare Workers"
    ERRORS=$((ERRORS+1))
  fi
else
  echo "SKIP: Cloudflare whoami skipped (no token)"
fi

# Check 3: ANTHROPIC_API_KEY — validated via live ping in Check 4 (wrangler secret list
# does not work with cfat_ Account API Tokens — use worker HTTP response as proxy)

# Check 4: Worker live ping (catches silent Anthropic key revocation)
WORKER_URL="https://ygw-api-proxy.leanspirited.workers.dev"
PING=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WORKER_URL/messages" \
  -H "Content-Type: application/json" \
  -H "Origin: https://asspirited.github.io" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":1,"messages":[{"role":"user","content":"ping"}]}' 2>/dev/null)
if [ "$PING" = "200" ]; then
  echo "GREEN: Worker live ping OK (HTTP 200) — Anthropic key valid"
elif [ "$PING" = "000" ]; then
  echo "RED: Worker unreachable (no response)"
  ERRORS=$((ERRORS+1))
else
  echo "RED: Worker ping returned HTTP $PING — Anthropic key may be revoked or worker down"
  echo "     Check: console.anthropic.com → API Keys — is YGW-production key active?"
  ERRORS=$((ERRORS+1))
fi

echo ""
if [ $ERRORS -gt 0 ]; then
  echo "CANARY: RED — $ERRORS auth error(s). STOP. Do not proceed with any work."
  echo "Fix guide: /home/rodent/your-green-gardening-wizard/.claude/practices/auth-ops.md"
  exit 1
else
  echo "CANARY: GREEN — all auth checks passed"
  exit 0
fi
