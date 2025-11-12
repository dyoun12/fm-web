#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TEMPLATE="sam/template.be.yaml"
REGION="ap-northeast-2"
SAMCONFIG_REL="sam/samconfig.be.toml"
SAMCONFIG="${ROOT}/${SAMCONFIG_REL}"
# Environment selection: default (dev) or prod
SAMENV="${ENV:-${1:-default}}"
PROFILE="${AWS_PROFILE:-${AWS_PROFILE_NAME:-fm-dev}}"
if [ "$SAMENV" = "prod" ]; then
  STACK_NAME="fm-web-backend-prod"
else
  STACK_NAME="fm-web-backend-dev"
fi

echo "[sam] building (container) env=$SAMENV profile=$PROFILE ..."
sam build \
  --config-file "$SAMCONFIG" \
  --config-env "$SAMENV" \
  --profile "$PROFILE" \
  --use-container \
  -t "$TEMPLATE"

if [ -z "${LWA_LAYER_ARN:-}" ]; then
  : # No-op: Web Adapter not used with Mangum
fi

echo "[sam] deploying env=$SAMENV profile=$PROFILE ..."
sam deploy \
  --config-file "$SAMCONFIG" \
  --config-env "$SAMENV" \
  --profile "$PROFILE" \
  --stack-name "$STACK_NAME" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --resolve-s3 \
  --region "$REGION"

echo "[sam] done. Use 'sam logs -n BackendFunction --stack-name $STACK_NAME --tail' to follow logs."
