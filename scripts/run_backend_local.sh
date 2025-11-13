#!/usr/bin/env bash
set -euo pipefail

COMMAND="${1:-up}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$ROOT/.devserver"
LOG_DIR="$STATE_DIR/logs"
COMPOSE_DIR="$ROOT/sam/local"
COMPOSE_FILE="$COMPOSE_DIR/docker-compose.dynamodb.yml"
ENDPOINT_URL="${DYNAMODB_ENDPOINT:-http://localhost:8000}"
POSTS_TABLE="${POSTS_TABLE:-fm_posts_local}"
CATEGORIES_TABLE="${CATEGORIES_TABLE:-fm_categories_local}"
ADMIN_TOKEN="${NEXT_PUBLIC_ADMIN_API_TOKEN:-local-dev-token}"
API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8001}"

mkdir -p "$STATE_DIR" "$LOG_DIR" "$COMPOSE_DIR/dynamodb-data"

COMPOSE_CMD=()

log() {
  printf '==> %s\n' "$*"
}

err() {
  printf '[ERROR] %s\n' "$*" >&2
}

usage() {
  cat <<'EOF'
Usage: ./scripts/run_backend_local.sh [command]

Commands:
  up       Start DynamoDB Local + FastAPI + Storybook + Next.js (background)
  down     Stop all local services and containers
  status   Show running status for each service
EOF
}

detect_compose() {
  if [[ ${#COMPOSE_CMD[@]} -gt 0 ]]; then
    return
  fi
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD=("docker" "compose")
    return
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD=("docker-compose")
    return
  fi
  err "docker compose plugin or docker-compose is required."
  exit 1
}

compose_up() {
  detect_compose
  log "Starting DynamoDB Local container"
  "${COMPOSE_CMD[@]}" -f "$COMPOSE_FILE" up -d
}

compose_down() {
  detect_compose
  log "Stopping DynamoDB Local container"
  "${COMPOSE_CMD[@]}" -f "$COMPOSE_FILE" down >/dev/null 2>&1 || true
}

bootstrap_dynamo() {
  log "Provisioning DynamoDB tables ($POSTS_TABLE, $CATEGORIES_TABLE)"
  local attempt=1
  local max_attempts=5
  while true; do
    if python3 "$ROOT/scripts/dynamodb_local_bootstrap.py" \
      --endpoint "$ENDPOINT_URL" \
      --posts-table "$POSTS_TABLE" \
      --categories-table "$CATEGORIES_TABLE"; then
      break
    fi
    if (( attempt >= max_attempts )); then
      err "Failed to provision DynamoDB tables after $max_attempts attempts."
      exit 1
    fi
    log "DynamoDB is not ready yet (attempt $attempt). Retrying in 2s..."
    sleep 2
    attempt=$((attempt + 1))
  done
}

ensure_node_modules() {
  if [[ -d "$ROOT/fe-app/node_modules" ]]; then
    return
  fi
  log "Installing fe-app dependencies (npm install)"
  (cd "$ROOT/fe-app" && npm install)
}

pid_file() {
  printf '%s/%s.pid' "$STATE_DIR" "$1"
}

log_file() {
  printf '%s/%s.log' "$LOG_DIR" "$1"
}

is_running() {
  local pf
  pf="$(pid_file "$1")"
  if [[ ! -f "$pf" ]]; then
    return 1
  fi
  local pid
  pid="$(cat "$pf")"
  if ps -p "$pid" >/dev/null 2>&1; then
    return 0
  fi
  rm -f "$pf"
  return 1
}

start_backend() {
  if is_running backend; then
    log "FastAPI already running (pid $(cat "$(pid_file backend)") )."
    return
  fi
  log "Starting FastAPI (uvicorn) on http://localhost:8001"
  local pf lf
  pf="$(pid_file backend)"
  lf="$(log_file backend)"
  (
    cd "$ROOT/be-app"
    USE_DYNAMO=1 \
    AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-dummy}" \
    AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-dummy}" \
    AWS_REGION="${AWS_REGION:-ap-northeast-2}" \
    DYNAMODB_ENDPOINT="$ENDPOINT_URL" \
    POSTS_TABLE="$POSTS_TABLE" \
    CATEGORIES_TABLE="$CATEGORIES_TABLE" \
    CORS_ALLOW_ORIGINS="${CORS_ALLOW_ORIGINS:-http://localhost:3000}" \
    nohup python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001 >"$lf" 2>&1 &
    echo $! >"$pf"
  )
}

start_storybook() {
  if is_running storybook; then
    log "Storybook already running (pid $(cat "$(pid_file storybook)") )."
    return
  fi
  log "Starting Storybook on http://localhost:6006"
  local pf lf
  pf="$(pid_file storybook)"
  lf="$(log_file storybook)"
  (
    cd "$ROOT/fe-app"
    nohup npx storybook dev -p 6006 >"$lf" 2>&1 &
    echo $! >"$pf"
  )
}

start_frontend() {
  if is_running frontend; then
    log "Next.js already running (pid $(cat "$(pid_file frontend)") )."
    return
  fi
  ensure_node_modules
  log "Starting Next.js dev server on http://localhost:3000"
  local pf lf
  pf="$(pid_file frontend)"
  lf="$(log_file frontend)"
  (
    cd "$ROOT/fe-app"
    NEXT_PUBLIC_API_BASE_URL="$API_BASE_URL" \
    NEXT_PUBLIC_ADMIN_API_TOKEN="$ADMIN_TOKEN" \
    NEXT_USE_TURBOPACK=0 \
    NEXT_FORCE_TURBOPACK=0 \
    NEXT_RUNTIME=webpack \
    nohup npx next dev --hostname 0.0.0.0 --port 3000 --webpack >"$lf" 2>&1 &
    echo $! >"$pf"
  )
}

stop_service() {
  local name="$1"
  local pf
  pf="$(pid_file "$name")"
  if [[ ! -f "$pf" ]]; then
    return
  fi
  local pid
  pid="$(cat "$pf")"
  if ! ps -p "$pid" >/dev/null 2>&1; then
    rm -f "$pf"
    return
  fi
  log "Stopping $name (pid $pid)"
  if command -v pkill >/dev/null 2>&1; then
    pkill -TERM -P "$pid" >/dev/null 2>&1 || true
  fi
  kill "$pid" >/dev/null 2>&1 || true
  for _ in {1..20}; do
    if ! ps -p "$pid" >/dev/null 2>&1; then
      break
    fi
    sleep 0.3
  done
  if ps -p "$pid" >/dev/null 2>&1; then
    log "Force killing $name (pid $pid)"
    kill -9 "$pid" >/dev/null 2>&1 || true
  fi
  rm -f "$pf"
}

stop_backend() {
  stop_service backend
}

stop_storybook() {
  stop_service storybook
}

stop_frontend() {
  stop_service frontend
}

print_status() {
  detect_compose
  log "Docker containers:"
  "${COMPOSE_CMD[@]}" -f "$COMPOSE_FILE" ps
  for svc in backend storybook frontend; do
    if is_running "$svc"; then
      printf '%-10s running (pid %s)\n' "$svc" "$(cat "$(pid_file "$svc")")"
    else
      printf '%-10s stopped\n' "$svc"
    fi
  done
  printf 'Logs directory: %s\n' "$LOG_DIR"
}

start_all() {
  compose_up
  bootstrap_dynamo
  start_backend
  start_storybook
  start_frontend
  log "All services are up. Logs -> $LOG_DIR. Run './scripts/run_backend_local.sh down' to stop."
}

stop_all() {
  stop_frontend
  stop_storybook
  stop_backend
  compose_down
  log "All services stopped."
}

case "$COMMAND" in
  up)
    start_all
    ;;
  down)
    stop_all
    ;;
  status)
    print_status
    ;;
  *)
    usage
    exit 1
    ;;
esac
