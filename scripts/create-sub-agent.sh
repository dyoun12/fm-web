#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <slug> \"<Title>\" [\"<Purpose>\"] [<scope>]" >&2
  echo "Example: $0 notifications \"Notifications\" \"시스템 알림 파이프라인 관리\" qa" >&2
  exit 1
fi

SLUG="$1"               # kebab-case e.g., notifications
TITLE="$2"              # Display title
PURPOSE="${3:-새 서브 에이전트}" # One-line purpose
SCOPE="${4:-custom}"    # ui|api|state|qa|docs|icons|custom

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATES_DIR="$ROOT_DIR/agents/templates"

DOC_DST="$ROOT_DIR/agents/Agents.$SLUG.md"
MANIFEST_DST="$ROOT_DIR/agents/manifests/$SLUG.yaml"

mkdir -p "$(dirname "$MANIFEST_DST")"

# PascalCase for slug (simple conversion: split by - and capitalize)
to_pascal() {
  echo "$1" | awk -F- '{ for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) } }1' OFS=""
}

SLUG_PASCAL="$(to_pascal "$SLUG")"

# Generate doc from template
sed -e "s/__AGENT_SLUG__/$SLUG/g" \
    -e "s/__AGENT_SLUG_PASCAL__/$SLUG_PASCAL/g" \
    -e "s/__AGENT_TITLE__/$TITLE/g" \
    -e "s/__AGENT_PURPOSE__/$PURPOSE/g" \
    "$TEMPLATES_DIR/sub-agent-doc.template.md" > "$DOC_DST"

# Generate manifest from template
sed -e "s/__AGENT_SLUG__/$SLUG/g" \
    -e "s/__AGENT_TITLE__/$TITLE/g" \
    -e "s/__AGENT_PURPOSE__/$PURPOSE/g" \
    -e "s/__AGENT_SCOPE__/$SCOPE/g" \
    "$TEMPLATES_DIR/agent-manifest.template.yaml" > "$MANIFEST_DST"

echo "Created: $DOC_DST"
echo "Created: $MANIFEST_DST"
echo "Reminder: Add entry to AGENTS.md Sub-Agents index if needed."

