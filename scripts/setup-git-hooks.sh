#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Configuring git hooks path to .githooks ..."
git config core.hooksPath .githooks

echo "Setting commit template to .gitmessage.txt ..."
git config commit.template .gitmessage.txt

echo "Ensuring hook files are executable ..."
chmod +x "$REPO_ROOT/.githooks/commit-msg"
chmod +x "$REPO_ROOT/.githooks/pre-commit"

echo "Done. Test by creating a commit: the hook will validate the header."
