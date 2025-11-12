#!/usr/bin/env bash
set -euo pipefail

# Build a Docker image that contains AWS Lambda Web Adapter under /opt/extensions,
# push it to ECR (optional), then extract the extension and publish a private Lambda Layer.

# Config (override via env or args)
PROFILE=${AWS_PROFILE:-fm-dev}
REGION=${AWS_REGION:-ap-northeast-2}
REPO_NAME=${ECR_REPO:-fm-lwa-adapter}
IMAGE_TAG=${IMAGE_TAG:-0.9.1-node20}
IMAGE_NAME_LOCAL="${REPO_NAME}:${IMAGE_TAG}"
LAYER_NAME=${LAYER_NAME:-fm-lwa-adapter-arm64}
PLATFORM=${PLATFORM:-linux/arm64}

usage() {
  cat <<EOF
Usage: AWS_PROFILE=fm-dev AWS_REGION=ap-northeast-2 bash $0 [build|push|layer|all]

Steps:
  build  - Build Docker image from lambdaLayer/Dockerfile (${PLATFORM})
  push   - Create ECR repo (if needed), login, tag and push image
  layer  - Extract /opt/extensions/lambda-adapter into a ZIP and publish a Lambda Layer
  all    - Run build + push + layer

Env overrides:
  AWS_PROFILE, AWS_REGION, ECR_REPO, IMAGE_TAG, LAYER_NAME, PLATFORM
EOF
}

cmd=${1:-all}

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
DOCKERFILE_PATH="${ROOT_DIR}/lambdaLayer/Dockerfile"
BUILD_DIR="${ROOT_DIR}/lambdaLayer/.build"
mkdir -p "${BUILD_DIR}"

account_id() {
  aws --profile "$PROFILE" --region "$REGION" sts get-caller-identity --query Account --output text
}

ensure_repo() {
  local acc repo_uri
  acc=$(account_id)
  repo_uri="${acc}.dkr.ecr.${REGION}.amazonaws.com/${REPO_NAME}"
  if ! aws --profile "$PROFILE" --region "$REGION" ecr describe-repositories --repository-names "$REPO_NAME" >/dev/null 2>&1; then
    aws --profile "$PROFILE" --region "$REGION" ecr create-repository --repository-name "$REPO_NAME" >/dev/null
    echo "Created ECR repository: ${repo_uri}"
  else
    echo "ECR repository exists: ${repo_uri}"
  fi
  echo "$repo_uri"
}

login_ecr() {
  aws --profile "$PROFILE" --region "$REGION" ecr get-login-password | \
    docker login --username AWS --password-stdin "$(account_id).dkr.ecr.${REGION}.amazonaws.com"
}

do_build() {
  echo "Building image ${IMAGE_NAME_LOCAL} for platform ${PLATFORM}..."
  docker build --platform "${PLATFORM}" -t "${IMAGE_NAME_LOCAL}" -f "${DOCKERFILE_PATH}" "${ROOT_DIR}/lambdaLayer"
}

do_push() {
  local repo_uri
  repo_uri=$(ensure_repo)
  login_ecr
  echo "Tagging and pushing to ${repo_uri}:${IMAGE_TAG}"
  docker tag "${IMAGE_NAME_LOCAL}" "${repo_uri}:${IMAGE_TAG}"
  docker push "${repo_uri}:${IMAGE_TAG}"
  echo "IMAGE_URI=${repo_uri}:${IMAGE_TAG}" > "${BUILD_DIR}/image_uri.txt"
}

do_layer() {
  echo "Extracting adapter from image and publishing layer ${LAYER_NAME}..."
  mkdir -p "${BUILD_DIR}/layer/extensions"
  # Create temp container and copy the extension binary
  local cid
  cid=$(docker create "${IMAGE_NAME_LOCAL}")
  docker cp "${cid}:/opt/extensions/lambda-adapter" "${BUILD_DIR}/layer/extensions/lambda-adapter"
  docker rm "${cid}" >/dev/null
  chmod +x "${BUILD_DIR}/layer/extensions/lambda-adapter"
  (cd "${BUILD_DIR}/layer" && zip -r9 "${BUILD_DIR}/lambda-adapter-layer.zip" extensions >/dev/null)

  # Publish the layer (arm64 compatible; runtime-agnostic extension)
  LAYER_ARN=$(aws --profile "$PROFILE" --region "$REGION" lambda publish-layer-version \
    --layer-name "$LAYER_NAME" \
    --compatible-architectures arm64 \
    --zip-file "fileb://${BUILD_DIR}/lambda-adapter-layer.zip" \
    --query 'LayerVersionArn' --output text)
  echo "Published Layer: ${LAYER_ARN}"
  echo "$LAYER_ARN" > "${BUILD_DIR}/layer_arn.txt"
}

case "$cmd" in
  build) do_build ;;
  push) do_push ;;
  layer) do_layer ;;
  all)
    do_build
    do_push || true
    do_layer
    ;;
  *) usage; exit 1 ;;
esac

echo "Done."

