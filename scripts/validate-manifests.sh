#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "[validate] Checking presence of project manifest..."
PROJECT="$ROOT_DIR/manifests/project.yaml"
test -s "$PROJECT" || { echo "Missing or empty: $PROJECT" >&2; exit 1; }

echo "[validate] Checking presence of agent manifests..."
shopt -s nullglob
AGENTS=("$ROOT_DIR"/agents/manifests/*.yaml)
if [ ${#AGENTS[@]} -eq 0 ]; then
  echo "No agent manifests found in agents/manifests" >&2; exit 1;
fi

echo "[validate] Baseline key checks..."
fail=0

require_keys() { # file key1 key2 ...
  local file="$1"; shift
  for key in "$@"; do
    if ! rg -n "^${key}:" "$file" >/dev/null 2>&1; then
      echo "[missing] $key in $(realpath --relative-to="$ROOT_DIR" "$file")" >&2
      fail=1
    fi
  done
}

# Baseline checks (fallback when AJV is not available)
require_keys "$PROJECT" name modules stack apps conventions security documentation workflows quality_gates

for f in "${AGENTS[@]}"; do
  require_keys "$f" id title purpose scope principles inputs outputs workflows dod links
done

# Optional: schema validation if ajv-cli is available
if command -v npx >/dev/null 2>&1 && npx --yes ajv-cli >/dev/null 2>&1; then
  echo "[validate] ajv-cli detected; running schema validation..."
  TMPJSON=$(mktemp)
  # Project manifest schema
  yq -oj "$PROJECT" > "$TMPJSON"
  npx --yes ajv-cli validate -s "$ROOT_DIR/manifests/schema/project-manifest.schema.json" -d "$TMPJSON" || fail=1
  rm -f "$TMPJSON"
  # Agent manifests schema
  for f in "${AGENTS[@]}"; do
    TMPJSON=$(mktemp)
    yq -oj "$f" > "$TMPJSON"
    npx --yes ajv-cli validate -s "$ROOT_DIR/agents/schema/agent-manifest.schema.json" -d "$TMPJSON" || fail=1
    rm -f "$TMPJSON"
  done
else
  echo "[validate] ajv-cli not found; ran baseline key checks only."
fi

if [ "$fail" -ne 0 ]; then
  echo "[validate] FAILED" >&2
  exit 1
fi

echo "[validate] OK"
