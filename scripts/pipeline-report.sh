#!/bin/bash
# pipeline-report.sh — YGW full pipeline runner with per-layer stats + coverage
# Exits 1 if any layer is RED.
# Usage: bash scripts/pipeline-report.sh

cd "$(dirname "$0")/.."

# Load CLOUDFLARE_API_TOKEN from ~/.bashrc if not already set
# (~/.bashrc guards against non-interactive shells, so we grep directly)
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -f "$HOME/.bashrc" ]; then
  TOKEN_LINE=$(grep -E '^export CLOUDFLARE_API_TOKEN=' "$HOME/.bashrc" | tail -1)
  if [ -n "$TOKEN_LINE" ]; then
    eval "$TOKEN_LINE"
    export CLOUDFLARE_API_TOKEN
  fi
fi

ERRORS=0
START_TIME=$(date +%s)

separator() { echo ""; echo "────────────────────────────────────────"; }

# Parse test stats from node --test TAP output
# Usage: parse_test_stats <output_string>
parse_test_stats() {
  local out="$1"
  local pass fail skip
  pass=$(echo "$out" | grep -oP '(?<=# pass )\d+' | tail -1)
  fail=$(echo "$out" | grep -oP '(?<=# fail )\d+' | tail -1)
  skip=$(echo "$out" | grep -oP '(?<=# skipped )\d+' | tail -1)
  echo "tests passed: ${pass:-0} | failed: ${fail:-0} | skipped: ${skip:-0}"
}

# Parse coverage from node --experimental-test-coverage output
# Extracts highest-level summary lines (line%, branch%)
parse_coverage() {
  local out="$1"
  local line_cov branch_cov
  # Node coverage table: look for lines like "domain.js | 100.00 | 100.00 | ..."
  # Pull the "all files" or per-file stats
  echo "$out" | grep -E '^\s*(all files|\S+\.js)' | grep -v '^$' | \
    awk '{printf "  %-30s line: %s%%  branch: %s%%\n", $1, $3, $5}' 2>/dev/null || true
}

# ── Layer 0: Auth canary ──
separator
echo "LAYER 0 — AUTH CANARY"
AUTH_OUT=$(bash scripts/check-auth.sh 2>&1)
if echo "$AUTH_OUT" | grep -q "CANARY: GREEN"; then
  echo "✅ GREEN"
  echo "$AUTH_OUT" | grep -E "^(GREEN|RED|SKIP)" | sed 's/^/   /'
else
  echo "❌ RED — stopping pipeline"
  echo "$AUTH_OUT" | grep -E "^(GREEN|RED|SKIP)" | sed 's/^/   /'
  exit 1
fi

# ── Layer 1: Unit tests ──
separator
echo "LAYER 1 — UNIT TESTS (domain.js)"
UNIT_START=$(date +%s)
UNIT_OUT=$(node --test --experimental-test-coverage tests/domain.test.js 2>&1)
UNIT_EXIT=$?
UNIT_END=$(date +%s)
UNIT_STATS=$(parse_test_stats "$UNIT_OUT")

if [ $UNIT_EXIT -eq 0 ]; then
  echo "✅ GREEN ($(( UNIT_END - UNIT_START ))s) | $UNIT_STATS"
else
  echo "❌ RED  ($(( UNIT_END - UNIT_START ))s) | $UNIT_STATS"
  ERRORS=$((ERRORS+1))
fi

echo "   Coverage:"
echo "$UNIT_OUT" | grep -E '\.(js)\s+\|' | \
  awk -F'|' '{
    file=$1; line=$2; branch=$3;
    gsub(/^ +| +$/, "", file);
    gsub(/^ +| +$/, "", line);
    gsub(/^ +| +$/, "", branch);
    printf "   %-32s line: %s%%  branch: %s%%\n", file, line, branch
  }' 2>/dev/null || echo "   (coverage data not available)"

# ── Layer 2: Contract verification ──
separator
echo "LAYER 2 — CONTRACT / PACT VERIFICATION"
CONTRACT_START=$(date +%s)
CONTRACT_OUT=$(node --test --experimental-test-coverage tests/contract.verify.test.js 2>&1)
CONTRACT_EXIT=$?
CONTRACT_END=$(date +%s)
CONTRACT_STATS=$(parse_test_stats "$CONTRACT_OUT")

INTERACTION_COUNT=$(node -e "
  const c = JSON.parse(require('fs').readFileSync('tests/contracts/ygw-browser-ygw-worker.pact.json','utf8'));
  console.log(c.interactions.length);
" 2>/dev/null || echo '?')

if [ $CONTRACT_EXIT -eq 0 ]; then
  echo "✅ GREEN ($(( CONTRACT_END - CONTRACT_START ))s) | $CONTRACT_STATS"
else
  echo "❌ RED  ($(( CONTRACT_END - CONTRACT_START ))s) | $CONTRACT_STATS"
  ERRORS=$((ERRORS+1))
fi
echo "   Contract: ygw-browser → ygw-worker | interactions: $INTERACTION_COUNT"

echo "   Coverage:"
echo "$CONTRACT_OUT" | grep -E '\.(js)\s+\|' | \
  awk -F'|' '{
    file=$1; line=$2; branch=$3;
    gsub(/^ +| +$/, "", file);
    gsub(/^ +| +$/, "", line);
    gsub(/^ +| +$/, "", branch);
    printf "   %-32s line: %s%%  branch: %s%%\n", file, line, branch
  }' 2>/dev/null || echo "   (coverage data not available)"

# ── Layer 3: Gherkin / BDD acceptance ──
separator
echo "LAYER 3 — GHERKIN / BDD ACCEPTANCE"
if [ -d "tests/acceptance" ] && [ "$(ls tests/acceptance/*.test.js 2>/dev/null)" ]; then
  ACCEPT_START=$(date +%s)
  ACCEPT_OUT=$(node --test --experimental-test-coverage tests/acceptance/*.test.js 2>&1)
  ACCEPT_EXIT=$?
  ACCEPT_END=$(date +%s)
  ACCEPT_STATS=$(parse_test_stats "$ACCEPT_OUT")
  if [ $ACCEPT_EXIT -eq 0 ]; then
    echo "✅ GREEN ($(( ACCEPT_END - ACCEPT_START ))s) | $ACCEPT_STATS"
  else
    echo "❌ RED  ($(( ACCEPT_END - ACCEPT_START ))s) | $ACCEPT_STATS"
    ERRORS=$((ERRORS+1))
  fi
  echo "   Coverage:"
  echo "$ACCEPT_OUT" | grep -E '\.(js)\s+\|' | \
    awk -F'|' '{
      file=$1; line=$2; branch=$3;
      gsub(/^ +| +$/, "", file);
      gsub(/^ +| +$/, "", line);
      gsub(/^ +| +$/, "", branch);
      printf "   %-32s line: %s%%  branch: %s%%\n", file, line, branch
    }' 2>/dev/null
else
  echo "⏭  SKIP — no tests/acceptance/ yet (add when first Gherkin scenario is implemented)"
fi

# ── Layer 4: UI tests ──
separator
echo "LAYER 4 — UI TESTS (Playwright)"
if [ -d "tests/ui" ] && [ "$(ls tests/ui/ 2>/dev/null)" ]; then
  UI_START=$(date +%s)
  if npx playwright test tests/ui/ 2>&1; then
    UI_END=$(date +%s)
    echo "✅ GREEN ($(( UI_END - UI_START ))s)"
  else
    UI_END=$(date +%s)
    echo "❌ RED  ($(( UI_END - UI_START ))s)"
    ERRORS=$((ERRORS+1))
  fi
else
  echo "⏭  SKIP — no tests/ui/ yet (Playwright, Phase 2)"
fi

# ── Layer 5: Non-functional ──
separator
echo "LAYER 5 — NON-FUNCTIONAL"

# 5a: OAT — Worker live ping
WORKER_URL="https://ygw-api-proxy.leanspirited.workers.dev"
OAT_START=$(date +%s)
PING=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 -X POST "$WORKER_URL/messages" \
  -H "Content-Type: application/json" \
  -H "Origin: https://asspirited.github.io" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":1,"messages":[{"role":"user","content":"ping"}]}' 2>/dev/null)
OAT_END=$(date +%s)
OAT_TIME=$(( OAT_END - OAT_START ))

if [ "$PING" = "200" ]; then
  echo "✅ OAT  — Worker live ping: GREEN (HTTP 200, ${OAT_TIME}s)"
else
  echo "❌ OAT  — Worker live ping: RED   (HTTP $PING, ${OAT_TIME}s)"
  ERRORS=$((ERRORS+1))
fi

echo "⏭  Perf — no benchmarks yet (YGW-044 phase 2)"
echo "⏭  Usability — manual via Ollie test (HDD-001)"

# ── Summary ──
END_TIME=$(date +%s)
TOTAL_TIME=$(( END_TIME - START_TIME ))
separator
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  YGW PIPELINE REPORT — $(date '+%Y-%m-%d %H:%M')  ║"
echo "╠══════════════════════════════════════════╣"
printf "║  %-40s ║\n" "Total time: ${TOTAL_TIME}s"
printf "║  %-40s ║\n" ""
printf "║  %-40s ║\n" "Layer 0 Auth:       $(bash scripts/check-auth.sh 2>&1 | grep -c GREEN)/3 checks GREEN"
printf "║  %-40s ║\n" "Layer 1 Unit:       $(parse_test_stats "$UNIT_OUT")"
printf "║  %-40s ║\n" "Layer 2 Contract:   $(parse_test_stats "$CONTRACT_OUT") | ${INTERACTION_COUNT} interactions"
printf "║  %-40s ║\n" "Layer 3 Acceptance: not yet built"
printf "║  %-40s ║\n" "Layer 4 UI:         not yet built"
printf "║  %-40s ║\n" "Layer 5 OAT:        Worker HTTP $PING"
printf "║  %-40s ║\n" ""
if [ $ERRORS -eq 0 ]; then
  printf "║  %-40s ║\n" "✅ ALL GREEN — safe to merge"
else
  printf "║  %-40s ║\n" "❌ ${ERRORS} LAYER(S) RED — do not merge"
fi
echo "╚══════════════════════════════════════════╝"
echo ""

[ $ERRORS -eq 0 ] && exit 0 || exit 1
