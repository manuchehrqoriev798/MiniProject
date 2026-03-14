#!/usr/bin/env bash
# Run backend + frontend locally. Uses existing backend/ and frontend/ in this folder (no download).

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "Error: backend/ and frontend/ must exist in this folder. Unzip the full MiniProject and try again."
  exit 1
fi

BACKEND_PID=""
cleanup() {
  if [ -n "$BACKEND_PID" ]; then
    echo ""
    echo "Stopping backend (PID $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup EXIT INT TERM

echo "=== Setting up backend ==="
cd "$ROOT/backend"
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
alembic upgrade head
python seed.py
echo "Starting backend on http://localhost:8000"
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd "$ROOT"

echo "Waiting for backend to be ready..."
sleep 4

echo "=== Setting up frontend ==="
cd "$ROOT/frontend"
npm install
echo "Starting frontend (will open in browser at http://localhost:3000)"
(sleep 6 && (xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null)) &
npm start
