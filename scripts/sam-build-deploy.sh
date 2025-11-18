#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TEMPLATE="sam/template.be.yaml"
REGION="ap-northeast-2"
SAMCONFIG_REL="sam/samconfig.be.toml"
SAMCONFIG="${ROOT}/${SAMCONFIG_REL}"
STACK_NAME="fm-web-backend-prod"

echo "[sam] building (container) env=$SAMENV..."
sam build \
  --config-file "$SAMCONFIG" \
  --use-container \
  -t "$TEMPLATE"

if [ -z "${LWA_LAYER_ARN:-}" ]; then
  : # No-op: Web Adapter not used with Mangum
fi

echo "[sam] deploying env=$SAMENV..."
sam deploy \
  --config-file "$SAMCONFIG" \
  --stack-name "$STACK_NAME" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --resolve-s3 \
  --region "$REGION"

echo "[sam] done. Use 'sam logs -n BackendFunction --stack-name $STACK_NAME --tail' to follow logs."
