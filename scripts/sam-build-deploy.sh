#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TEMPLATE="sam/template.yaml"
STACK_NAME="fm-web-backend-dev"
REGION="ap-northeast-2"

echo "[sam] building..."
sam build -t "$TEMPLATE"

if [ -z "$LWA_LAYER_ARN" ]; then
  : # No-op: Web Adapter not used with Mangum
fi

echo "[sam] deploying..."
sam deploy \
  --stack-name "$STACK_NAME" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --resolve-s3 \
  --region "$REGION" \
  --parameter-overrides \
    StageName=dev \
    PostsTableName=fm_posts \
    CategoriesTableName=fm_categories \
    UploadsBucketName=fm-web-uploads \
    AllowedOrigins=http://localhost:3000

echo "[sam] done. Use 'sam logs -n BackendFunction --stack-name $STACK_NAME --tail' to follow logs."
