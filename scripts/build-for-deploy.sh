#!/usr/bin/env bash
# Build frontend and copy into backend/static for single-app deployment.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
STATIC_DIR="$BACKEND_DIR/static"

echo "Building frontend (API base URL = /api)..."
cd "$FRONTEND_DIR"
export REACT_APP_API_URL=/api
export REACT_APP_API_BASE_URL=
npm ci --prefer-offline --no-audit
npm run build

echo "Copying build to backend/static..."
rm -rf "$STATIC_DIR"
mkdir -p "$STATIC_DIR"
cp -r build/* "$STATIC_DIR/"

echo "Done. Start backend with: cd backend && uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
exit 0
