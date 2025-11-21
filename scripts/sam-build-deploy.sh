#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TEMPLATE="sam/template.be.yaml"
REGION="ap-northeast-2"
SAMCONFIG_REL="sam/samconfig.be.toml"
SAMCONFIG="${ROOT}/${SAMCONFIG_REL}"
STACK_NAME="fm-web-backend-prod"

echo "[sam] building (container)"
sam build \
  --config-file "$SAMCONFIG" \
  --use-container \
  -t "$TEMPLATE"

if [ -z "${LWA_LAYER_ARN:-}" ]; then
  : # No-op: Web Adapter not used with Mangum
fi

echo "[sam] deploying"
PARAM_OVERRIDES="StageName=prod PostsTableName=fm_posts CategoriesTableName=fm_categories CorpMetaTableName=fm_corp_meta UploadsBucketName=fm-web-uploads AllowedOrigins=https://www.fmcorp.kr"

# Cognito-related parameters are injected via environment variables (e.g. GitHub Actions secrets).
COGNITO_REGION_PARAM="${COGNITO_REGION:-$REGION}"
: "${COGNITO_USER_POOL_ID:?COGNITO_USER_POOL_ID is required}"
: "${COGNITO_CLIENT_ID:?COGNITO_CLIENT_ID is required}"
: "${COGNITO_DOMAIN:?COGNITO_DOMAIN is required}"
: "${COGNITO_REDIRECT_URI:?COGNITO_REDIRECT_URI is required}"
: "${COGNITO_LOGOUT_REDIRECT_URI:?COGNITO_LOGOUT_REDIRECT_URI is required}"

PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoRegion=${COGNITO_REGION_PARAM}"
PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoUserPoolId=${COGNITO_USER_POOL_ID}"
PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoClientId=${COGNITO_CLIENT_ID}"
PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoDomain=${COGNITO_DOMAIN}"
PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoRedirectUri=${COGNITO_REDIRECT_URI}"
PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoLogoutRedirectUri=${COGNITO_LOGOUT_REDIRECT_URI}"

if [ -n "${COGNITO_JWKS_URL:-}" ]; then
  PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoJwksUrl=${COGNITO_JWKS_URL}"
fi
if [ -n "${COGNITO_CLIENT_SECRET:-}" ]; then
  PARAM_OVERRIDES="$PARAM_OVERRIDES CognitoClientSecret=${COGNITO_CLIENT_SECRET}"
fi

sam deploy \
  --config-file "$SAMCONFIG" \
  --stack-name "$STACK_NAME" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --resolve-s3 \
  --region "$REGION" \
  --parameter-overrides $PARAM_OVERRIDES

echo "[sam] done. Use 'sam logs -n BackendFunction --stack-name $STACK_NAME --tail' to follow logs."
