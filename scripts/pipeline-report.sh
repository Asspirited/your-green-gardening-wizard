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
AUTH_TIME=0; UNIT_TIME=0; CONTRACT_TIME=0; ACCEPT_TIME=0; UI_TIME=0; OAT_TIME=0
AUTH_RESULT="—"; UNIT_RESULT="—"; CONTRACT_RESULT="—"
ACCEPT_RESULT="SKIP"; UI_RESULT="SKIP"; OAT_RESULT="—"
UNIT_LINE="—"; UNIT_BRANCH="—"; UNIT_BUGS=0
CONTRACT_LINE="—"; CONTRACT_BRANCH="—"; CONTRACT_BUGS=0
ACCEPT_LINE="—"; ACCEPT_BRANCH="—"; ACCEPT_BUGS=0

# Extract statement (line) and branch coverage for a given source file from node coverage output
# Usage: extract_cov <output> <filename_fragment>
extract_line_cov()   { echo "$1" | grep -E "$2" | grep -v test | head -1 | awk -F'|' '{gsub(/ /,"",$2); print $2}'; }
extract_branch_cov() { echo "$1" | grep -E "$2" | grep -v test | head -1 | awk -F'|' '{gsub(/ /,"",$3); print $3}'; }

# Extract fail count from node --test output
extract_bugs() { echo "$1" | grep -oP '(?<=# fail )\d+' | tail -1 || echo "0"; }

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
AUTH_L0_START=$(date +%s)
AUTH_OUT=$(bash scripts/check-auth.sh 2>&1)
AUTH_L0_END=$(date +%s)
AUTH_TIME=$(( AUTH_L0_END - AUTH_L0_START ))
if echo "$AUTH_OUT" | grep -q "CANARY: GREEN"; then
  AUTH_RESULT="✅ GREEN"
  echo "✅ GREEN (${AUTH_TIME}s)"
  echo "$AUTH_OUT" | grep -E "^(GREEN|RED|SKIP)" | sed 's/^/   /'
else
  AUTH_RESULT="❌ RED"
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

UNIT_TIME=$(( UNIT_END - UNIT_START ))
UNIT_LINE=$(extract_line_cov "$UNIT_OUT" "domain\.js")
UNIT_BRANCH=$(extract_branch_cov "$UNIT_OUT" "domain\.js")
UNIT_BUGS=$(extract_bugs "$UNIT_OUT")
if [ $UNIT_EXIT -eq 0 ]; then
  UNIT_RESULT="✅ GREEN"
  echo "✅ GREEN (${UNIT_TIME}s) | $UNIT_STATS"
else
  UNIT_RESULT="❌ RED"
  echo "❌ RED  (${UNIT_TIME}s) | $UNIT_STATS"
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

CONTRACT_TIME=$(( CONTRACT_END - CONTRACT_START ))
CONTRACT_LINE=$(extract_line_cov "$CONTRACT_OUT" "worker/index\.js")
CONTRACT_BRANCH=$(extract_branch_cov "$CONTRACT_OUT" "worker/index\.js")
CONTRACT_BUGS=$(extract_bugs "$CONTRACT_OUT")
if [ $CONTRACT_EXIT -eq 0 ]; then
  CONTRACT_RESULT="✅ GREEN"
  echo "✅ GREEN (${CONTRACT_TIME}s) | $CONTRACT_STATS"
else
  CONTRACT_RESULT="❌ RED"
  echo "❌ RED  (${CONTRACT_TIME}s) | $CONTRACT_STATS"
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
  ACCEPT_TIME=$(( ACCEPT_END - ACCEPT_START ))
  if [ $ACCEPT_EXIT -eq 0 ]; then
    ACCEPT_RESULT="✅ GREEN"
    echo "✅ GREEN (${ACCEPT_TIME}s) | $ACCEPT_STATS"
  else
    ACCEPT_RESULT="❌ RED"
    echo "❌ RED  (${ACCEPT_TIME}s) | $ACCEPT_STATS"
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
    UI_TIME=$(( UI_END - UI_START ))
    UI_RESULT="✅ GREEN"
    echo "✅ GREEN (${UI_TIME}s)"
  else
    UI_END=$(date +%s)
    UI_TIME=$(( UI_END - UI_START ))
    UI_RESULT="❌ RED"
    echo "❌ RED  (${UI_TIME}s)"
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
  OAT_RESULT="✅ GREEN (HTTP 200)"
  echo "✅ OAT  — Worker live ping: GREEN (HTTP 200, ${OAT_TIME}s)"
else
  OAT_RESULT="❌ RED (HTTP $PING)"
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
echo "╔════════════════════════════════════════════════════════════════════════╗"
printf "║  YGW PIPELINE REPORT — %-48s║\n" "$(date '+%Y-%m-%d %H:%M')"
echo "╠════════════════════════════════════════════════════════════════════════╣"
printf "║  %-14s %-12s %8s %8s %6s %7s ║\n" "Layer"        "Result"    "Stmt%"   "Branch%"  "Time"  "Bugs"
printf "║  %-14s %-12s %8s %8s %6s %7s ║\n" "──────────────" "──────────" "──────" "───────" "────" "──────"
printf "║  %-14s %-12s %8s %8s %5ss %7s ║\n" "0 Auth"       "$AUTH_RESULT"     "—"              "—"                "$AUTH_TIME"     "—"
printf "║  %-14s %-12s %8s %8s %5ss %7s ║\n" "1 Unit"       "$UNIT_RESULT"     "${UNIT_LINE}"   "${UNIT_BRANCH}"   "$UNIT_TIME"     "$UNIT_BUGS"
printf "║  %-14s %-12s %8s %8s %5ss %7s ║\n" "2 Contract"   "$CONTRACT_RESULT" "${CONTRACT_LINE}" "${CONTRACT_BRANCH}" "$CONTRACT_TIME" "$CONTRACT_BUGS"
printf "║  %-14s %-12s %8s %8s %5ss %7s ║\n" "3 Acceptance" "$ACCEPT_RESULT"   "—"              "—"                "$ACCEPT_TIME"   "$ACCEPT_BUGS"
printf "║  %-14s %-12s %8s %8s %5ss %7s ║\n" "4 UI"         "$UI_RESULT"       "—"              "—"                "$UI_TIME"       "—"
printf "║  %-14s %-12s %8s %8s %5ss %7s ║\n" "5 OAT"        "$OAT_RESULT"      "—"              "—"                "$OAT_TIME"      "—"
echo "╠════════════════════════════════════════════════════════════════════════╣"
printf "║  %-70s ║\n" "Total build + test time: ${TOTAL_TIME}s"
printf "║  %-70s ║\n" ""
if [ $ERRORS -eq 0 ]; then
  printf "║  %-70s ║\n" "✅  ALL GREEN — safe to merge"
else
  printf "║  %-70s ║\n" "❌  ${ERRORS} LAYER(S) RED — do not merge"
fi
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

[ $ERRORS -eq 0 ] && exit 0 || exit 1
